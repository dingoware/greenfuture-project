import { describe, expect, it } from 'vitest';
import { estimateImpact } from './calculator';

describe('estimateImpact', () => {
  it('returns zero-ish impact when nothing is selected', () => {
    const result = estimateImpact({
      platformIds: [],
      useCaseIds: [],
      frequencyId: 'light',
      regionMode: 'global',
      regionCode: 'US'
    });

    expect(result.monthlySessions).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.notes.length).toBeGreaterThan(0);
  });

  it('scales up for heavier use and creative workloads', () => {
    const light = estimateImpact({
      platformIds: ['chatgpt'],
      useCaseIds: ['chat'],
      frequencyId: 'light',
      regionMode: 'global',
      regionCode: 'US'
    });

    const heavy = estimateImpact({
      platformIds: ['chatgpt', 'midjourney', 'runway'],
      useCaseIds: ['chat', 'image', 'video'],
      frequencyId: 'heavy',
      regionMode: 'global',
      regionCode: 'US'
    });

    expect(heavy.energyWh).toBeGreaterThan(light.energyWh);
    expect(heavy.waterMl).toBeGreaterThan(light.waterMl);
    expect(heavy.emissionsKg).toBeGreaterThan(light.emissionsKg);
    expect(heavy.score).toBeLessThan(light.score);
  });

  it('changes emissions when region changes', () => {
    const globalEstimate = estimateImpact({
      platformIds: ['chatgpt'],
      useCaseIds: ['coding'],
      frequencyId: 'weekly',
      regionMode: 'global',
      regionCode: 'US'
    });

    const usEstimate = estimateImpact({
      platformIds: ['chatgpt'],
      useCaseIds: ['coding'],
      frequencyId: 'weekly',
      regionMode: 'us',
      regionCode: 'NYUP'
    });

    expect(globalEstimate.emissionsKg).not.toBe(usEstimate.emissionsKg);
  });

  it('keeps the score within bounds', () => {
    const result = estimateImpact({
      platformIds: ['chatgpt', 'claude', 'midjourney', 'runway'],
      useCaseIds: ['chat', 'research', 'coding', 'writing', 'image', 'video'],
      frequencyId: 'heavy',
      regionMode: 'us',
      regionCode: 'PRMS'
    });

    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });
});
