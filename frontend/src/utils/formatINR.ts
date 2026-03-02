/**
 * Formats a number as Indian Rupee with proper Indian number grouping.
 * Example: 250000 → ₹2,50,000 | 1000000 → ₹10,00,000
 */
export default function formatINR(amount: number): string {
  if (amount === 0) return '₹0';

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const str = Math.floor(absAmount).toString();

  let result = '';
  const len = str.length;

  if (len <= 3) {
    result = str;
  } else {
    // Last 3 digits
    result = str.slice(len - 3);
    // Remaining digits in groups of 2
    let remaining = str.slice(0, len - 3);
    while (remaining.length > 2) {
      result = remaining.slice(remaining.length - 2) + ',' + result;
      remaining = remaining.slice(0, remaining.length - 2);
    }
    if (remaining.length > 0) {
      result = remaining + ',' + result;
    }
  }

  return (isNegative ? '-₹' : '₹') + result;
}
