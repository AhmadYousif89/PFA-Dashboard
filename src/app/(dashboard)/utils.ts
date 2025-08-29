export function getCurrentMonthRange(now = new Date()) {
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { startOfMonth, endOfMonth };
}

export function nextMonthlyDue(lastPayment: Date) {
  const d = new Date(lastPayment);
  d.setMonth(d.getMonth() + 1);
  return d;
}

export function isWithinDays(from: Date, target: Date, days: number) {
  const end = new Date(from);
  end.setDate(from.getDate() + days);
  return target >= from && target <= end;
}

export function norm(n: string) {
  return (n ?? "")
    .toLowerCase()
    .trim()
    .replace(/[\s._-]+/g, "")
    .replace(/[^a-z0-9]/g, "");
}

// Build cycle window from due day anchored to "now"
function daysInMonth(y: number, m: number) {
  return new Date(y, m + 1, 0).getDate();
}
function dateWithDOM(y: number, m: number, d: number) {
  return new Date(y, m, Math.min(d, daysInMonth(y, m)));
}
export function getCycleBoundsFromDueDay(dueDay: number, now = new Date()) {
  const y = now.getFullYear();
  const m = now.getMonth();
  const currentDue = dateWithDOM(y, m, dueDay);
  if (now >= currentDue) {
    // In or after current cycle start; next due is next month’s dueDay
    return {
      cycleStart: currentDue,
      nextDue: dateWithDOM(y, m + 1, dueDay),
    };
  }
  // Before this month’s due day; current cycle started last month’s dueDay
  return {
    cycleStart: dateWithDOM(y, m - 1, dueDay),
    nextDue: currentDue,
  };
}
