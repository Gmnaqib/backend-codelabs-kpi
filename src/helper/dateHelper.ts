import { DateTime } from "luxon";

const ZONE = "Asia/Jakarta";

const dateHelper = {
  getStartOfDayWIB(): Date {
    return DateTime.now().setZone(ZONE).startOf("day").toJSDate();
  },

  getEndOfDayWIB(): Date {
    return DateTime.now().setZone(ZONE).endOf("day").toJSDate();
  },

  formatDateWIB(date: Date): string {
    return DateTime.fromJSDate(date).setZone(ZONE).toFormat("yyyy-MM-dd HH:mm:ss");
  },

  getNowWIBAsDateTime(): DateTime {
    return DateTime.now().setZone(ZONE);
  },

  getTimeTodayWIB(hour: number, minute = 0, second = 0): DateTime {
    return DateTime.now().setZone(ZONE).set({
      hour,
      minute,
      second,
      millisecond: 0,
    });
  },

  isSunday(): boolean {
    const date = DateTime.now().setZone(ZONE);
    return date.weekday === 7;
  },

  getDate(date: Date): string {
    const isoDate = DateTime.fromJSDate(date).setZone(ZONE).toISODate();
    if (!isoDate) {
      throw new Error("Failed to convert date to ISO format");
    }
    return isoDate;
  },

  convertToIndonesiaTime(date: Date | null | undefined): Date | null {
    if (!date) return null;
    // Convert UTC to Indonesia time (UTC+7)
    const dt = DateTime.fromJSDate(date).setZone(ZONE);
    return dt.toJSDate();
  },

  formatToIndonesiaTimeISO(date: Date | null | undefined): string | null {
    if (!date) return null;
    const dt = DateTime.fromJSDate(date).setZone(ZONE);
    return dt.toISO();
  },
};

export default dateHelper;
