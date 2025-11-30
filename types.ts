export enum ModelType {
  GEMINI_2_5_FLASH = 'gemini-2.5-flash-latest',
  GEMINI_2_5_PRO = 'gemini-2.5-pro-latest',
  GEMINI_3_PRO = 'gemini-3-pro-preview',
}

export enum OutputType {
  PERSONAS = 'Personas',
  PLAYBOOK = 'Marketing Playbook',
  CALENDAR_7 = '7-Day Content Calendar',
  CALENDAR_14 = '14-Day Content Calendar',
  CALENDAR_21 = '21-Day Content Calendar',
  CALENDAR_30 = '30-Day Content Calendar',
}

export interface BusinessFormData {
  businessName: string;
  industry: string;
  products: string;
  targetAudience: string;
  painPoints: string;
  goals: string;
  competitors: string;
  usp: string;
  marketingDetails: string;
  selectedOutput: OutputType;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  formData: BusinessFormData;
  content: string;
  model: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}