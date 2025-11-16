import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const validateFrenchPhone = (phone: string): boolean => {
  if (!phone) return false;
  // Remove spaces, dashes and dots but preserve leading + for +33
  const cleaned = phone.replace(/[\s\-\.]/g, '');

  // Accept:
  // - national: 0XXXXXXXXX (10 digits starting with 0)
  // - international: +33Xxxxxxxxx or 0033Xxxxxxxxx (country code then 9 digits, no leading 0)
  const pattern = /^(?:0[1-9]\d{8}|(?:\+33|0033)[1-9]\d{8})$/;
  return pattern.test(cleaned);
};

export const formatPhoneNumber = (value: string): string => {
  if (!value) return '';

  // remove spaces/dots/dashes but keep leading +
  const cleanedInput = value.trim().replace(/[\s\-\.]/g, '');

  // International +33 or 0033
  if (cleanedInput.startsWith('+33') || cleanedInput.startsWith('0033')) {
    const isPlus = cleanedInput.startsWith('+33');
    const prefix = isPlus ? '+33' : '0033';
    const rest = cleanedInput.slice(isPlus ? 3 : 4).replace(/\D/g, '').slice(0, 9); // 9 national digits after country code

    // Format: +33 X XX XX XX XX  (first group 1 digit then pairs)
    const match = rest.match(/^(\d)(\d{2})?(\d{2})?(\d{2})?(\d{2})?/);
    if (match) {
      let formatted = prefix;
      formatted += ' ' + match[1];
      if (match[2]) formatted += ' ' + match[2];
      if (match[3]) formatted += ' ' + match[3];
      if (match[4]) formatted += ' ' + match[4];
      if (match[5]) formatted += ' ' + match[5];
      return formatted;
    }
    return prefix + (rest ? ' ' + rest : '');
  }

  // National format starting with 0
  const digits = cleanedInput.replace(/\D/g, '').slice(0, 10); // up to 10 digits
  const match = digits.match(/^(\d{2})(\d{2})?(\d{2})?(\d{2})?(\d{2})?/);
  if (match) {
    let formatted = match[1];
    if (match[2]) formatted += ' ' + match[2];
    if (match[3]) formatted += ' ' + match[3];
    if (match[4]) formatted += ' ' + match[4];
    if (match[5]) formatted += ' ' + match[5];
    return formatted;
  }

  return digits;
};

// export const validateFrenchPhone = (phone: string): boolean => {
//   // Remove all spaces, dashes, and dots
//   const cleaned = phone.replace(/[\s\-\.]/g, '');
  
//   // Accept only 0XXXXXXXXX format (10 digits starting with 0)
//   const pattern = /^0[1-9]\d{8}$/;
  
//   return pattern.test(cleaned);
// };

// export const formatPhoneNumber = (value: string): string => {
//   // Only allow digits
//   const cleaned = value.replace(/\D/g, '');
  
//   // Limit to 10 digits
//   const limited = cleaned.slice(0, 10);
  
//   // Format: 0X XX XX XX XX
//   const match = limited.match(/^(\d{2})(\d{2})?(\d{2})?(\d{2})?(\d{2})?/);
//   if (match) {
//     let formatted = match[1];
//     if (match[2]) formatted += ' ' + match[2];
//     if (match[3]) formatted += ' ' + match[3];
//     if (match[4]) formatted += ' ' + match[4];
//     if (match[5]) formatted += ' ' + match[5];
//     return formatted;
//   }
  
//   return limited;
// };