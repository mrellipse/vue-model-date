import { addDays, differenceInCalendarDays, isEqual, format, parse } from 'date-fns/esm';
import { IDateHelper } from './date-helper';

export class DateFnsFormatter implements IDateHelper {

    constructor(public pattern: string) {

    }

    adjustDate(leftDate: Date, rightDate: Date): Date {
        var diff = differenceInCalendarDays(leftDate, rightDate);
        return diff === 0 ? null : addDays(rightDate, diff);
    }

    equal(leftDate: Date, rightDate: Date): boolean {
        return isEqual(leftDate, rightDate);
    }

    format(value: Date, pattern?: string): string {
        return format(value, pattern || this.pattern);
    }

    parse(value: string, pattern?: string): Date {
        return parse(value, pattern || this.pattern, new Date())
    }
}

export default DateFnsFormatter;