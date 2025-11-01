import { Home, Building2, Sparkles, CalendarCheck } from 'lucide-react';
import { Service, ServiceWithIcon } from '@/types/service';

/* eslint-disable @typescript-eslint/no-explicit-any */
const iconMap: Record<string, any> = {
  HOUSEWORK: Home,
  AIRBNB: CalendarCheck,
  OFFICE: Building2,
  TEST: Sparkles,
};

export function mapServiceWithIcon(service: Service): ServiceWithIcon {
  return {
    ...service,
    icon: iconMap[service.code] || Home,
  };
}

export function formatPrice(rate: number, preferredRate?: number): string {
  if (preferredRate && preferredRate < rate) {
    return `À partir de ${preferredRate.toFixed(0)}€`;
  }
  return `À partir de ${rate.toFixed(0)}€`;
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours}h`;
  return `${hours}h${mins}`;
}