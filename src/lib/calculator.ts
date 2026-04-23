import {
  categoryLabels,
  egridRegions,
  frequencies,
  platforms,
  useCases,
  type FrequencyId,
  type PlatformCategory,
  type RegionId,
  type UseCaseId
} from '../data';

export interface CalculatorInput {
  platformIds: string[];
  useCaseIds: UseCaseId[];
  frequencyId: FrequencyId;
  regionMode: RegionId;
  regionCode: string;
}

export interface CalculatorEstimate {
  monthlySessions: number;
  energyWh: number;
  waterMl: number;
  emissionsKg: number;
  score: number;
  low: {
    energyWh: number;
    waterMl: number;
    emissionsKg: number;
  };
  high: {
    energyWh: number;
    waterMl: number;
    emissionsKg: number;
  };
  notes: string[];
}

const baseProfiles: Record<PlatformCategory, { energyWh: number; waterMl: number }> = {
  chat: { energyWh: 0.75, waterMl: 11 },
  research: { energyWh: 0.85, waterMl: 13 },
  coding: { energyWh: 0.9, waterMl: 12 },
  image: { energyWh: 4.8, waterMl: 48 },
  video: { energyWh: 18, waterMl: 150 }
};

const useCaseWeights: Record<UseCaseId, number> = {
  chat: 0.9,
  research: 1,
  coding: 1.15,
  writing: 0.8,
  image: 2.8,
  video: 6.5
};

const fitMatrix: Record<UseCaseId, Record<PlatformCategory, number>> = {
  chat: { chat: 1.2, research: 1, coding: 1, image: 0.1, video: 0.05 },
  research: { chat: 1.05, research: 1.25, coding: 0.9, image: 0.08, video: 0.05 },
  coding: { chat: 1.15, research: 1.05, coding: 1.3, image: 0.08, video: 0.05 },
  writing: { chat: 1.15, research: 0.95, coding: 0.7, image: 0.05, video: 0.05 },
  image: { chat: 0.1, research: 0.08, coding: 0.08, image: 1.4, video: 0.2 },
  video: { chat: 0.05, research: 0.05, coding: 0.05, image: 0.3, video: 1.55 }
};

const frequencySessions = Object.fromEntries(frequencies.map((frequency) => [frequency.id, frequency.monthlySessions])) as Record<FrequencyId, number>;

const uncertaintyBands = {
  energy: { low: 0.7, high: 1.35 },
  water: { low: 0.55, high: 1.7 },
  emissions: { low: 0.7, high: 1.45 }
};

const regionIntensityKgPerKwh = (regionMode: RegionId, regionCode: string) => {
  if (regionMode === 'global') {
    return 0.42;
  }

  const region = egridRegions.find((entry) => entry.id === regionCode) ?? egridRegions.find((entry) => entry.id === 'US');
  return region ? (region.co2eLbPerMWh * 0.45359237) / 1000 : 0.42;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function estimateImpact(input: CalculatorInput): CalculatorEstimate {
  const selectedPlatforms = platforms.filter((platform) => input.platformIds.includes(platform.id));
  const platformCategories = selectedPlatforms.map((platform) => platform.category);
  const sessions = frequencySessions[input.frequencyId] ?? 0;

  const taskWeights = input.useCaseIds.length > 0 ? input.useCaseIds.map((task) => useCaseWeights[task]) : [0];
  const taskDemand = taskWeights.reduce((sum, value) => sum + value, 0) / Math.max(1, taskWeights.length);
  const monthlySessions = sessions * taskDemand;

  const matches = selectedPlatforms.length > 0
    ? selectedPlatforms.map((platform) => {
        const fit = input.useCaseIds.length > 0
          ? input.useCaseIds.reduce((sum, task) => sum + fitMatrix[task][platform.category], 0) / input.useCaseIds.length
          : 1;
        return { platform, fit };
      })
    : [];

  const totalFit = matches.reduce((sum, item) => sum + item.fit, 0) || 1;
  const regionKgPerKwh = regionIntensityKgPerKwh(input.regionMode, input.regionCode);

  const totals = matches.reduce(
    (acc, item) => {
      const platformShare = item.fit / totalFit;
      const base = baseProfiles[item.platform.category];
      const usageUnits = monthlySessions * platformShare;
      const energy = usageUnits * base.energyWh;
      const water = usageUnits * base.waterMl;
      const emissions = (energy / 1000) * regionKgPerKwh;

      acc.energyWh += energy;
      acc.waterMl += water;
      acc.emissionsKg += emissions;
      return acc;
    },
    { energyWh: 0, waterMl: 0, emissionsKg: 0 }
  );

  const fallbackBase = selectedPlatforms.length > 0
    ? selectedPlatforms.reduce((acc, platform) => {
        const base = baseProfiles[platform.category];
        acc.energyWh += base.energyWh;
        acc.waterMl += base.waterMl;
        return acc;
      }, { energyWh: 0, waterMl: 0 })
    : { energyWh: 1, waterMl: 12 };

  const averageBaseEnergy = fallbackBase.energyWh / Math.max(1, selectedPlatforms.length);
  const averageBaseWater = fallbackBase.waterMl / Math.max(1, selectedPlatforms.length);
  const uncertaintyBoost = 1 + input.useCaseIds.filter((useCase) => useCase === 'image' || useCase === 'video').length * 0.12;

  const energyWh = totals.energyWh;
  const waterMl = totals.waterMl;
  const emissionsKg = totals.emissionsKg;

  const score = clamp(
    Math.round(
      100 -
        (Math.log1p(emissionsKg * 1000) * 20 +
          Math.log1p(energyWh) * 8 +
          Math.log1p(waterMl / 10) * 5)
    ),
    0,
    100
  );

  const topDrivers = [
    ...input.useCaseIds.map((useCase) => ({
      type: 'use case',
      label: useCases.find((option) => option.id === useCase)?.label ?? useCase
    })),
    ...platformCategories.map((category) => ({
      type: 'platform category',
      label: categoryLabels[category]
    }))
  ];

  const notes: string[] = [];
  if (input.useCaseIds.includes('video')) {
    notes.push('Video generation is the most resource-intensive use case in this estimate.');
  } else if (input.useCaseIds.includes('image')) {
    notes.push('Image generation drives a large share of the estimated load.');
  } else if (input.useCaseIds.includes('coding') || input.useCaseIds.includes('research')) {
    notes.push('Coding and research tend to stay below creative generation workloads, but they still add up at high frequency.');
  }

  if (selectedPlatforms.some((platform) => platform.category === 'video')) {
    notes.push('Video tools usually dominate the total when they are part of the mix.');
  }
  if (selectedPlatforms.some((platform) => platform.category === 'image')) {
    notes.push('Image tools increase water and energy use more than chat-only tools.');
  }
  if (input.regionMode === 'us') {
    notes.push('Your selected U.S. grid region adjusts emissions using EPA eGRID 2023 rates.');
  } else {
    notes.push('Emissions use a broad global fallback factor when no grid region is selected.');
  }

  const platformCount = Math.max(1, selectedPlatforms.length);
  const lowEnergy = energyWh * uncertaintyBands.energy.low * (1 / uncertaintyBoost) * (1 + (platformCount - 1) * 0.02);
  const highEnergy = energyWh * uncertaintyBands.energy.high * uncertaintyBoost * (1 + (platformCount - 1) * 0.05);
  const lowWater = waterMl * uncertaintyBands.water.low * (1 / uncertaintyBoost);
  const highWater = waterMl * uncertaintyBands.water.high * uncertaintyBoost;
  const lowEmissions = emissionsKg * uncertaintyBands.emissions.low;
  const highEmissions = emissionsKg * uncertaintyBands.emissions.high * uncertaintyBoost;

  if (selectedPlatforms.length === 0) {
    notes.unshift('Select at least one platform to generate a meaningful estimate.');
  }

  if (input.useCaseIds.length === 0) {
    notes.unshift('Select one or more use cases so the calculator can weight the platforms correctly.');
  }

  if (selectedPlatforms.length > 1 && input.useCaseIds.length > 1) {
    notes.push('Multiple platform and task selections are weighted by fit rather than split evenly.');
  }

  if (selectedPlatforms.length > 0) {
    notes.push(
      `The result is normalized across ${platformCount} platform${platformCount === 1 ? '' : 's'} and ${input.useCaseIds.length || 1} task${input.useCaseIds.length === 1 ? '' : 's'}.`
    );
  }

  if (averageBaseEnergy > 0 && averageBaseWater > 0) {
    notes.push(
      `Baseline profiles use normalized reference values of about ${averageBaseEnergy.toFixed(2)} Wh and ${averageBaseWater.toFixed(0)} mL per weighted AI session.`
    );
  }

  topDrivers.slice(0, 2).forEach((item) => {
    notes.push(`Top driver: ${item.label}.`);
  });

  return {
    monthlySessions,
    energyWh,
    waterMl,
    emissionsKg,
    score,
    low: {
      energyWh: lowEnergy,
      waterMl: lowWater,
      emissionsKg: lowEmissions
    },
    high: {
      energyWh: highEnergy,
      waterMl: highWater,
      emissionsKg: highEmissions
    },
    notes
  };
}

export function formatNumber(value: number, digits = 1) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(value);
}

export function formatKg(value: number) {
  return `${formatNumber(value, value >= 10 ? 1 : 2)} kg`;
}

export function formatWh(value: number) {
  if (value >= 1000) {
    return `${formatNumber(value / 1000, 2)} kWh`;
  }

  return `${formatNumber(value, 1)} Wh`;
}

export function formatWater(value: number) {
  if (value >= 1000) {
    return `${formatNumber(value / 1000, 2)} L`;
  }

  return `${formatNumber(value, 0)} mL`;
}
