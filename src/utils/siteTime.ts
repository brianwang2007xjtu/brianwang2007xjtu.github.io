import config from "@/config";

/**
 * 站点统一使用**北京时间**（`config.site.timezone`，默认 Asia/Shanghai）来算「哪一天」。
 *
 * 构建机器、CI 或访问者的时区都可能是 UTC 或别的时区，直接用
 * `toISOString().slice(0, 10)` 会在北京时间刚过零点时把文章算到前一天，
 * 于是热力图、日历、统计都会差一天。这里统一按站点时区取日期。
 */

const TIME_ZONE = config.site.timezone;

const dayFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const yearFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  year: "numeric",
});

const partsFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "numeric",
  day: "numeric",
});

/** `YYYY-MM-DD`，按站点时区（北京时间）。 */
export function dayKey(value: Date | number = new Date()): string {
  return dayFormatter.format(typeof value === "number" ? new Date(value) : value);
}

/** 年 / 月 / 日，按站点时区。 */
export function dateParts(value: Date | number = new Date()): {
  year: number;
  month: number;
  day: number;
} {
  const parts = partsFormatter.formatToParts(
    typeof value === "number" ? new Date(value) : value
  );
  const get = (type: string) =>
    Number(parts.find(part => part.type === type)?.value ?? 0);
  return { year: get("year"), month: get("month"), day: get("day") };
}

/** 当前年份，按站点时区。 */
export function currentYear(): number {
  return Number(yearFormatter.format(new Date()));
}

/** 把一个 `YYYY-MM-DD` 变回该日 UTC 零点的毫秒数（只用于算天数差）。 */
export function keyToUTC(key: string): number {
  const [y, m, d] = key.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

/** 站点时区下两个时刻相差的天数（含首尾）。 */
export function daysBetweenKeys(from: string, to: string): number {
  return Math.floor((keyToUTC(to) - keyToUTC(from)) / 86400000);
}
