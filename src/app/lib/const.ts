export type TyphoonModel = 'typhoon-v2-8b-instruct' | 'typhoon-v2.1-12b-instruct' | 'typhoon-v2-70b-instruct' | 'typhoon-v2-r1-70b-preview';

export interface ModelParameters {
  name: string;
  description: string;
  descriptionTh?: string;
  maxTokens: number;
  temperature: number;
  maxContentLength: number;
}

export const MODEL_PARAMETERS: Record<TyphoonModel, ModelParameters> = {
  "typhoon-v2.1-12b-instruct": {
    maxTokens: 1000,
    temperature: 0.7,
    maxContentLength: 12000 * 2,
    name: 'Typhoon2.1 12B',
    description: 'Versatile 12B parameter model for all task',
    descriptionTh: 'โมเดลอเนกประสงค์ขนาด 12B พารามิเตอร์สำหรับทุกงาน'
  },
  "typhoon-v2-70b-instruct": {
    maxTokens: 1000,
    temperature: 0.7,
    maxContentLength: 12000 * 2,
    name: 'Typhoon2 70B',
    description: 'Powerful 70B parameter model for complex task',
    descriptionTh: 'โมเดลประสิทธิภาพสูงขนาด 70B พารามิเตอร์สำหรับงานซับซ้อน'
  },
  "typhoon-v2-r1-70b-preview": {
    maxTokens: 1000,
    temperature: 0.7,
    maxContentLength: 12000 * 2,
    name: 'Typhoon2 R1 70B',
    description: '70B model with strong reasoning capabilities',
    descriptionTh: 'โมเดลขนาด 70B ที่มีความสามารถในการให้เหตุผลที่แข็งแกร่ง'
  },
  "typhoon-v2-8b-instruct": {
    maxTokens: 1000,
    temperature: 0.7,
    maxContentLength: 12000 * 2,
    name: 'Typhoon2 8B',
    description: 'Efficient 8B parameter model for faster responses',
    descriptionTh: 'โมเดลประสิทธิภาพดีขนาด 8B พารามิเตอร์สำหรับการตอบสนองที่เร็วขึ้น'
  },
}; 