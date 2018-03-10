import Vue, { VNodeDirective } from 'vue';
import { IDateHelper, isDateHelperMixin } from './date-helper';

export function isDirectiveOptions(value: any): value is IDirectiveOptions {
    return value && value['value'] && (typeof value['value'] === 'string' || value['value'] instanceof Date);
}

export interface IDirectiveOptions {
    value: string | Date;
    pattern?: string;
    adjustDate?: (leftDate: Date, rightDate: Date) => Date;
    equal?: (leftDate: Date, rightDate: Date) => boolean;
    format?: (value: Date, pattern: string) => string;
    parse?: (value: string, pattern: string) => Date;
}

export class DirectiveHelper implements IDateHelper {

    private original: Date = null;
    private current: Date = null;
    private hooks: Map<string, Function> = null;
    private strategy: (value: Date) => void;

    private buildUpdateStrategy(binding: VNodeDirective, context: Vue) {

        let data = binding.value;

        if (isDirectiveOptions(data))
            return (value: Date) => {
                context.$set(<any>context, <string>data.value, value)
                context.$emit('input', value);
            };
        else
            return (value: Date) => {
                context[binding.expression] = value;
                context.$emit('input', value);
            }
    }

    private buildHooks(binding: VNodeDirective, context: Vue): Map<string, Function> {

        let map = new Map<string, Function>();
        var data = binding.value;

        if (data) {
            Object.getOwnPropertyNames(data).forEach((o) => {
                if (isDateHelperMixin(o, typeof data[o]))
                    map.set(o, data[o]);
            });
        }

        return map;
    }

    constructor(public helper: IDateHelper, binding: VNodeDirective, context: Vue, value: Date) {
        this.currentDate = value;
        this.hooks = this.buildHooks(binding, context);
        this.strategy = this.buildUpdateStrategy(binding, context);
    }

    public get currentDate(): Date {
        return this.current;
    }

    public set currentDate(value: Date) {

        if (this.original === null)
            this.original = value;

        this.current = value;
    }

    public get pattern() {
        return this.helper.pattern;
    }

    public set pattern(value: string) {
        this.helper.pattern = value;
    }

    public get originalDate(): Date {
        return this.original;
    }

    adjustDate(leftDate: Date, rightDate: Date): Date {
        if (this.hooks.has('adjustDate'))
            return this.hooks.get('adjustDate').apply(leftDate, rightDate);
        else
            return this.helper.adjustDate(leftDate, rightDate);
    }

    equal(leftDate: Date, rightDate: Date): boolean {
        if (this.hooks.has('equal'))
            return this.hooks.get('equal').apply(leftDate, rightDate);
        else
            return this.helper.equal(leftDate, rightDate);
    }

    format(value: Date, pattern?: string): string {
        if (this.hooks.has('format'))
            return this.hooks.get('format').apply(value, pattern);
        else
            return this.helper.format(value, pattern);
    }

    parse(value: string, pattern?: string): Date {
        if (this.hooks.has('parse'))
            return this.hooks.get('parse').apply(value, pattern);
        else
            return this.helper.parse(value, pattern);
    }

    public get updateModel() {
        return this.strategy;
    }
};

export default DirectiveHelper;