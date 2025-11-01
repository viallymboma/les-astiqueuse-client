import { LucideIcon } from 'lucide-react';

export interface ServiceOption {
  id: number;
  optionId: number;
  optionCode: string;
  optionName: string;
  optionDescription: string;
  optionType: 'ADDON' | 'FORMULA';
  optionStatus: string;
  rate: number;
}

export interface Service {
  id: number;
  code: string;
  name: string;
  description: string;
  standardRate: number;
  preferredRate?: number;
  vatRate: number;
  minDuration: number;
  maxDuration: number;
  durationIncrement: number;
  status: string;
  options: ServiceOption[];
}

export interface ServiceWithIcon extends Service {
  icon: LucideIcon;
}