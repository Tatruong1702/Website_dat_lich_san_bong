/**
 * Format a number as Vietnamese currency (VND)
 * @param {number} amount
 * @returns {string} e.g. "150.000 ₫"
 */
export function formatCurrency(amount) {
  if (amount == null || isNaN(amount)) return "—";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a date string (YYYY-MM-DD) to Vietnamese readable
 * @param {string} dateStr
 * @returns {string} e.g. "Thứ Bảy, 14/06/2025"
 */
export function formatDate(dateStr) {
  if (!dateStr) return "—";
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Format a time string (HH:MM or HH:MM:SS) to HH:MM
 * @param {string} timeStr
 * @returns {string} e.g. "14:30"
 */
export function formatTime(timeStr) {
  if (!timeStr) return "—";
  return timeStr.slice(0, 5);
}

/**
 * Calculate duration in hours between two HH:MM strings
 * @param {string} startTime
 * @param {string} endTime
 * @returns {number}
 */
export function calcDurationHours(startTime, endTime) {
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  return (eh * 60 + em - (sh * 60 + sm)) / 60;
}

/**
 * Truncate a string to max length with ellipsis
 */
export function truncate(str, maxLen = 50) {
  if (!str) return "";
  return str.length > maxLen ? str.slice(0, maxLen) + "…" : str;
}
