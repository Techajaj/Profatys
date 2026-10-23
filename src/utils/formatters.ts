import { RegistrationCostBreakdown } from '../types';

/**
 * Formatting utilities for Bangladesh Real Estate currency, area, loan calculations,
 * and government registration fees.
 */

export function formatBDTPrice(
  amount: number,
  isRent: boolean = false,
  rentPeriod: string = 'month'
): string {
  if (amount == null || isNaN(amount)) return '৳ 0';

  if (isRent) {
    return `৳ ${amount.toLocaleString('en-IN')}/${rentPeriod === 'year' ? 'yr' : 'mo'}`;
  }

  // Crore (1,00,00,000+)
  if (amount >= 10000000) {
    const croreVal = amount / 10000000;
    return `৳ ${croreVal.toFixed(2).replace(/\.00$/, '')} Crore`;
  }

  // Lakh (1,00,000+)
  if (amount >= 100000) {
    const lakhVal = amount / 100000;
    return `৳ ${lakhVal.toFixed(2).replace(/\.00$/, '')} Lakh`;
  }

  return `৳ ${amount.toLocaleString('en-IN')}`;
}

export function formatNumberBD(num: number): string {
  if (num == null) return '0';
  return num.toLocaleString('en-IN');
}

export function calculatePricePerSqFt(price: number, areaSqFt: number): string {
  if (!price || !areaSqFt || areaSqFt <= 0) return 'N/A';
  const val = Math.round(price / areaSqFt);
  return `৳ ${val.toLocaleString('en-IN')} / sq.ft`;
}

export interface EMICalculation {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  loanAmount: number;
}

export function calculateMortgageEMI(
  propertyPrice: number,
  downPaymentPercent: number, // e.g. 20
  annualInterestRate: number, // e.g. 9.5%
  tenureYears: number // e.g. 15
): EMICalculation {
  const downPayment = (propertyPrice * downPaymentPercent) / 100;
  const loanAmount = Math.max(0, propertyPrice - downPayment);

  if (loanAmount <= 0) {
    return {
      monthlyPayment: 0,
      totalPayment: 0,
      totalInterest: 0,
      loanAmount: 0,
    };
  }

  const monthlyRate = annualInterestRate / 12 / 100;
  const totalMonths = tenureYears * 12;

  // EMI formula = [P x R x (1+R)^N]/[(1+R)^N-1]
  const numerator = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths);
  const denominator = Math.pow(1 + monthlyRate, totalMonths) - 1;

  const monthlyPayment = denominator === 0 ? 0 : numerator / denominator;
  const totalPayment = monthlyPayment * totalMonths;
  const totalInterest = totalPayment - loanAmount;

  return {
    monthlyPayment: Math.round(monthlyPayment),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
    loanAmount: Math.round(loanAmount),
  };
}

/**
 * Bangladesh Property Deed & Registration Cost Estimator (Sub-Registry Directorate Standards)
 * - Stamp Duty: 1.5%
 * - Registration Fee: 1.0%
 * - Local Government Tax (City Corp / Pourashava): 2.0%
 * - Advance Income Tax (AIT / Gain Tax under Section 53C): 4.0%
 * - Mutation, E-Porcha & Certified Copy Fee: Flat ~5,000 BDT
 */
export function calculateBDRegistrationCosts(propertyPrice: number): RegistrationCostBreakdown {
  if (!propertyPrice || propertyPrice <= 0) {
    return {
      stampDuty: 0,
      registrationFee: 0,
      localGovtTax: 0,
      gainTaxAIT: 0,
      mutationFee: 0,
      totalCost: 0,
    };
  }

  const stampDuty = Math.round(propertyPrice * 0.015);
  const registrationFee = Math.round(propertyPrice * 0.01);
  const localGovtTax = Math.round(propertyPrice * 0.02);
  const gainTaxAIT = Math.round(propertyPrice * 0.04);
  const mutationFee = 5000;

  const totalCost = stampDuty + registrationFee + localGovtTax + gainTaxAIT + mutationFee;

  return {
    stampDuty,
    registrationFee,
    localGovtTax,
    gainTaxAIT,
    mutationFee,
    totalCost,
  };
}

/**
 * Validates Bangladeshi mobile phone numbers (+8801XXXXXXXXX or 01XXXXXXXXX)
 */
export function validateBDPhone(phone: string): boolean {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  const bdRegex = /^(\+8801|8801|01)[3-9]\d{8}$/;
  return bdRegex.test(cleaned);
}

/**
 * Client-side basic sanitization for user submissions
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/[<>]/g, '');
}
