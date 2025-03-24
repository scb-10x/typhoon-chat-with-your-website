export type TyphoonModel = 'typhoon-v2-8b-instruct' | 'typhoon-v2-70b-instruct' | 'typhoon-v2-r1-70b-preview';

export interface ModelParameters {
  name: string;
  description: string;
  maxTokens: number;
  temperature: number;
  maxContentLength: number;
}

export const MODEL_PARAMETERS: Record<TyphoonModel, ModelParameters> = {
  "typhoon-v2-70b-instruct": {
    maxTokens: 1000,
    temperature: 0.7,
    maxContentLength: 12000 * 2,
    name: 'Typhoon 70B', 
    description: 'Powerful 70B parameter model for complex task'
  },
  "typhoon-v2-r1-70b-preview": {
    maxTokens: 1000,
    temperature: 0.7,
    maxContentLength: 12000 * 2,
    name: 'Typhoon2 R1 70B',
    description: '70B model with strong reasoning capabilities'
  },
  "typhoon-v2-8b-instruct": {
    maxTokens: 1000,
    temperature: 0.7,
    maxContentLength: 12000 * 2,
    name: 'Typhoon 8B',
    description: 'Efficient 8B parameter model for faster responses'
  },
}; 