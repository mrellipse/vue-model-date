import { DirectiveFunction, DirectiveOptions, VNodeDirective, VNode } from 'vue';
import { DateFnsFormatter } from './date-fns-formatter';
import { DirectiveHelper, isDirectiveOptions } from './directive-helper'

function createHelper(el: HTMLInputElement, binding: VNodeDirective, vnode: VNode) {

    let helper: DirectiveHelper = null;
    const defaultFormatString = 'YYYY-MM-DD';

    if (el.tagName.toLowerCase() === 'input' && el.type.toLowerCase() === 'date' || el.type.toLowerCase() === 'text') {

        let data = binding.value;
        let formatter = new DateFnsFormatter(defaultFormatString);

        if (!data) {
            helper = new DirectiveHelper(formatter, binding, vnode.context, null);
        }
        else if (isDirectiveOptions(data)) {
            let value = typeof data.value === 'string' ? vnode.context[data.value] : data.value;

            if (el.type.toLowerCase() === 'text' && data.pattern)
                formatter = new DateFnsFormatter(data.pattern);

            helper = new DirectiveHelper(formatter, binding, vnode.context, value);
        }
        else if (data instanceof Date) {
            helper = new DirectiveHelper(formatter, binding, vnode.context, data);
        }
        else if (typeof data === 'string') {
            helper = new DirectiveHelper(formatter, binding, vnode.context, formatter.parse(data));
        }
    } else {
        emitWarning('can only bind to input elements of type= \'date\' or \'text\'');
    }

    return helper;
}

function createOptions() {

    let helper: DirectiveHelper = null;

    let inserted = (el: HTMLInputElement, binding: VNodeDirective, vnode: VNode, oldVnode: VNode) => {

        let helper = createHelper(el, binding, vnode);

        if (helper !== null) {
            let context = vnode.context;
            let expression = binding.expression;

            if (helper.currentDate) {
                el.value = helper.format(helper.currentDate);
                el.valueAsDate = helper.currentDate;
            }

            el.dataset.hasNativeSupport = hasNativeSupport() ? '0' : '1';

            el.addEventListener('change', ($event: Event) => {

                let value: string = (<HTMLInputElement>$event.target).value;

                if (value) {
                    let date = helper.adjustDate(helper.parse(value), helper.currentDate);

                    if (date && !helper.equal(helper.currentDate, date))
                        helper.updateModel(date);
                } else if (value === '') {
                    el.value = '';
                    helper.updateModel(null);
                }
            });
        }
    }

    return {
        inserted: inserted
    };
}

function emitWarning(msg: string) {
    console.warn('vue-model-date:' + msg.trim());
}

function hasNativeSupport() {
    let test = document.createElement('input');
    test.type = 'date';
    return test.type !== 'text';
}

export { DateHelperHooks as VueModelDateHooks } from './date-helper';
export const VueModelDate: DirectiveOptions = createOptions();
export default VueModelDate;


