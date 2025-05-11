import { DateTime } from 'luxon';

const ZONE = 'Asia/Jakarta';

export function getStartOfDayWIB(): Date {
  return DateTime.now().setZone(ZONE).startOf('day').toJSDate();
}

export function getEndOfDayWIB(): Date {
  return DateTime.now().setZone(ZONE).endOf('day').toJSDate();
}

export function formatDateWIB(date: Date): string {
  return DateTime.fromJSDate(date).setZone(ZONE).toFormat('yyyy-MM-dd HH:mm:ss');
}

export function getNowWIBAsDateTime(): DateTime {
  return DateTime.now().setZone(ZONE);
}

export function getTimeTodayWIB(hour: number, minute = 0, second = 0): DateTime {
  return DateTime.now().setZone(ZONE).set({
    hour,
    minute,
    second,
    millisecond: 0,
  });
}
