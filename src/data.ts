export type PlatformCategory = 'chat' | 'research' | 'coding' | 'image' | 'video';
export type UseCaseId = 'chat' | 'research' | 'coding' | 'writing' | 'image' | 'video';
export type FrequencyId = 'light' | 'weekly' | 'regular' | 'daily' | 'heavy';
export type RegionId = 'global' | 'us';

export interface PlatformOption {
  id: string;
  label: string;
  category: PlatformCategory;
  description: string;
}

export interface UseCaseOption {
  id: UseCaseId;
  label: string;
  description: string;
}

export interface FrequencyOption {
  id: FrequencyId;
  label: string;
  monthlySessions: number;
  description: string;
}

export interface RegionOption {
  id: RegionId;
  label: string;
  description: string;
}

export interface RegionEmissionRegion {
  id: string;
  label: string;
  co2eLbPerMWh: number;
}

export const platforms: PlatformOption[] = [
  {
    id: 'chatgpt',
    label: 'ChatGPT',
    category: 'chat',
    description: 'General chat, coding help, and broad-purpose assistant usage.'
  },
  {
    id: 'claude',
    label: 'Claude',
    category: 'chat',
    description: 'Long-form writing, analysis, and reasoning tasks.'
  },
  {
    id: 'gemini',
    label: 'Gemini',
    category: 'research',
    description: 'Search-adjacent research, writing, and assistant workflows.'
  },
  {
    id: 'copilot',
    label: 'Microsoft Copilot',
    category: 'coding',
    description: 'Productivity and coding assistance inside Microsoft and GitHub tools.'
  },
  {
    id: 'perplexity',
    label: 'Perplexity',
    category: 'research',
    description: 'Answer-first research and browsing-style AI usage.'
  },
  {
    id: 'meta-ai',
    label: 'Meta AI',
    category: 'chat',
    description: 'General conversational AI use across Meta products.'
  },
  {
    id: 'mistral',
    label: 'Mistral',
    category: 'chat',
    description: 'General-purpose and developer-oriented assistant usage.'
  },
  {
    id: 'grok',
    label: 'Grok',
    category: 'chat',
    description: 'Conversational assistant usage with general-purpose prompts.'
  },
  {
    id: 'midjourney',
    label: 'Midjourney',
    category: 'image',
    description: 'Text-to-image generation and visual exploration.'
  },
  {
    id: 'dall-e',
    label: 'DALL·E',
    category: 'image',
    description: 'OpenAI image generation and editing workflows.'
  },
  {
    id: 'firefly',
    label: 'Adobe Firefly',
    category: 'image',
    description: 'Commercial image generation and design support.'
  },
  {
    id: 'stable-diffusion',
    label: 'Stable Diffusion',
    category: 'image',
    description: 'Open ecosystem image generation and local workflows.'
  },
  {
    id: 'leonardo',
    label: 'Leonardo AI',
    category: 'image',
    description: 'Image generation and asset creation for creative work.'
  },
  {
    id: 'runway',
    label: 'Runway',
    category: 'video',
    description: 'Generative video editing and motion content.'
  },
  {
    id: 'pika',
    label: 'Pika',
    category: 'video',
    description: 'Text-to-video generation and short-form clips.'
  },
  {
    id: 'luma',
    label: 'Luma Dream Machine',
    category: 'video',
    description: 'Video generation and cinematic prompt workflows.'
  }
];

export const useCases: UseCaseOption[] = [
  {
    id: 'chat',
    label: 'General chat',
    description: 'Answering questions, planning, brainstorming, and quick help.'
  },
  {
    id: 'research',
    label: 'Research',
    description: 'Searching, comparing sources, and summarizing information.'
  },
  {
    id: 'coding',
    label: 'Coding',
    description: 'Programming, debugging, refactoring, and code generation.'
  },
  {
    id: 'writing',
    label: 'Writing',
    description: 'Drafting emails, essays, summaries, and other text content.'
  },
  {
    id: 'image',
    label: 'Image generation',
    description: 'Creating or editing still images and graphics.'
  },
  {
    id: 'video',
    label: 'Video generation',
    description: 'Creating or editing motion content and clips.'
  }
];

export const frequencies: FrequencyOption[] = [
  {
    id: 'light',
    label: 'A few times a month',
    monthlySessions: 4,
    description: 'Occasional use with short sessions.'
  },
  {
    id: 'weekly',
    label: '1 to 3 times a week',
    monthlySessions: 12,
    description: 'Regular but not daily use.'
  },
  {
    id: 'regular',
    label: 'Most days',
    monthlySessions: 24,
    description: 'Typical weekday or near-daily use.'
  },
  {
    id: 'daily',
    label: 'Once or twice a day',
    monthlySessions: 60,
    description: 'Daily use with several prompts or generations.'
  },
  {
    id: 'heavy',
    label: 'Multiple times a day',
    monthlySessions: 180,
    description: 'High-volume use, often with repeated generations.'
  }
];

export const regionModes: RegionOption[] = [
  {
    id: 'global',
    label: 'Global average',
    description: 'Uses a broad fallback emission factor when region is unknown.'
  },
  {
    id: 'us',
    label: 'U.S. grid region',
    description: 'Select a specific EPA eGRID subregion for a more precise estimate.'
  }
];

export const egridRegions: RegionEmissionRegion[] = [
  { id: 'AKGD', label: 'Alaska Grid', co2eLbPerMWh: 905.109 },
  { id: 'AKMS', label: 'Alaska Miscellaneous', co2eLbPerMWh: 522.4 },
  { id: 'AZNM', label: 'Arizona / New Mexico', co2eLbPerMWh: 706.189 },
  { id: 'CAMX', label: 'California', co2eLbPerMWh: 429.983 },
  { id: 'ERCT', label: 'ERCOT / Texas', co2eLbPerMWh: 736.629 },
  { id: 'FRCC', label: 'Florida', co2eLbPerMWh: 784.785 },
  { id: 'HIMS', label: 'Hawaii Mainland Systems', co2eLbPerMWh: 1133.294 },
  { id: 'HIOA', label: 'Hawaii Other Areas', co2eLbPerMWh: 1498.947 },
  { id: 'MROE', label: 'Midwest Reliability East', co2eLbPerMWh: 1404.963 },
  { id: 'MROW', label: 'Midwest Reliability West', co2eLbPerMWh: 926.552 },
  { id: 'NEWE', label: 'New England', co2eLbPerMWh: 543.178 },
  { id: 'NWPP', label: 'Northwest Power Pool', co2eLbPerMWh: 635.267 },
  { id: 'NYCW', label: 'New York City and Westchester', co2eLbPerMWh: 865.744 },
  { id: 'NYLI', label: 'Long Island', co2eLbPerMWh: 1189.333 },
  { id: 'NYUP', label: 'Upstate New York', co2eLbPerMWh: 242.776 },
  { id: 'PRMS', label: 'Puerto Rico', co2eLbPerMWh: 1548.53 },
  { id: 'RFCE', label: 'RFC East', co2eLbPerMWh: 599.17 },
  { id: 'RFCM', label: 'RFC Mid-Atlantic', co2eLbPerMWh: 975.978 },
  { id: 'RFCW', label: 'RFC West', co2eLbPerMWh: 916.054 },
  { id: 'RMPA', label: 'Rocky Mountain Power Area', co2eLbPerMWh: 1042.539 },
  { id: 'SPNO', label: 'SERC North', co2eLbPerMWh: 867.74 },
  { id: 'SPSO', label: 'SERC South', co2eLbPerMWh: 875.567 },
  { id: 'SRMV', label: 'SERC Mississippi Valley', co2eLbPerMWh: 741.741 },
  { id: 'SRMW', label: 'SERC Midwest', co2eLbPerMWh: 1248.582 },
  { id: 'SRSO', label: 'SERC South Central', co2eLbPerMWh: 846.007 },
  { id: 'SRTV', label: 'SERC Tennessee Valley', co2eLbPerMWh: 903.306 },
  { id: 'SRVC', label: 'SERC Virginia / Carolinas', co2eLbPerMWh: 596.326 },
  { id: 'US', label: 'U.S. average', co2eLbPerMWh: 770.884 }
];

export const sourceLinks = [
  {
    label: 'IEA Energy and AI',
    href: 'https://www.iea.org/reports/energy-and-ai'
  },
  {
    label: 'EPA eGRID summary data',
    href: 'https://www.epa.gov/egrid/summary-data'
  },
  {
    label: 'EIA emissions factors FAQ',
    href: 'https://www.eia.gov/tools/faqs/faq.php?id=76&t=11'
  },
  {
    label: 'Making AI Less Thirsty',
    href: 'https://arxiv.org/abs/2304.03271'
  },
  {
    label: 'BLOOM carbon footprint',
    href: 'https://arxiv.org/abs/2211.02001'
  }
] as const;

export const categoryLabels: Record<PlatformCategory, string> = {
  chat: 'chat',
  research: 'research',
  coding: 'coding',
  image: 'image',
  video: 'video'
};
