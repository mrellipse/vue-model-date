export const DateHelperHooks: string[] = ['adjustDate', 'equal', 'format', 'parse'];

export interface IDateHelper {
    adjustDate(leftDate: Date, rightDate: Date): Date;
    equal(leftDate: Date, rightDate: Date): boolean;
    parse(value: string, pattern?: string): Date;
    format(value: Date, pattern?: string): string;
    pattern: string;
}

export function isDateHelperMixin(name: string, type: string): boolean {
    return DateHelperHooks.findIndex((o) => o.toLowerCase() === name.toLowerCase() && type === 'function') > -1;
}