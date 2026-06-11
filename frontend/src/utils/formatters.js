export function formatHours(hours = 0) {
  return `${Math.round(hours).toLocaleString()}h`;
}

export function formatPrice(price = 0) {
  if (price === 0) return 'Free';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export function formatDate(dateString) {
  if (!dateString) return 'Never played';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateString));
}

export function daysSince(dateString) {
  if (!dateString) return null;
  const elapsed = Date.now() - new Date(dateString).getTime();
  return Math.max(0, Math.floor(elapsed / 86400000));
}
