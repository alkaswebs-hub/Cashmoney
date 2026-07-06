export function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function timeAgo(date: string | Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return 'just now';
}

export function generateReference(prefix: string = 'CM'): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${ts}${rand}`;
}

export function isWithinWithdrawWindow(
  startTime: string,
  endTime: string,
  allowedDays: string
): boolean {
  const now = new Date();
  const watOffset = 1;
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const wat = new Date(utc + watOffset * 3600000);

  const dayMap: Record<number, string> = { 0: '0', 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6' };
  const todayStr = dayMap[wat.getDay()];
  const days = allowedDays.split(',');
  if (!days.includes(todayStr)) return false;

  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  const startMin = sh * 60 + sm;
  const endMin = eh * 60 + em;
  const nowMin = wat.getHours() * 60 + wat.getMinutes();

  return nowMin >= startMin && nowMin <= endMin;
}
