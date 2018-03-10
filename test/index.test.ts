import { assert } from "chai";
import { } from 'mocha';
import Vue from 'vue';
import { VueModelDateHooks, VueModelDate } from "../src/index";
import { dispatchEvent } from './helper';

const defaultDate = new Date(2011, 0, 13);
const defaultDateString = '2011-01-13';

function setup(date: Date | string, template: string) {
    return new Vue({
        template: template,
        directives: {
            'model-date': VueModelDate
        },
        data: () => { return { myDate: date } }
    });
};

describe("Directive@Vue-Model-Date", () => {

    const templateInputText = `<input type="text" v-model-date="myDate"/>`;
    const templateInputTextCustom = `<input type="text" v-model-date="{ value: 'myDate', pattern: 'DD-MM-YYYY' }"/>`;
    const templateInputDate = `<input type="date" v-model-date="myDate"/>`;

    describe("input.type === 'text'", () => {

        it("binds to vm property", () => {

            const vm = setup(defaultDateString, templateInputText).$mount();

            const target = <HTMLInputElement>vm.$el;

            assert.equal(target.value, defaultDateString);
            assert.equal(target.valueAsDate.toUTCString(), defaultDate.toUTCString());
        });

        it("binds to vm object", () => {

            let vm = new Vue({
                template: `<input type="text" v-model-date="settings"/>`,
                directives: {
                    'model-date': VueModelDate
                },
                data: () => {
                    return {
                        from: defaultDate,
                        settings: {
                            value: 'from'
                        }
                    }
                }
            }).$mount();

            const target = <HTMLInputElement>vm.$el;

            assert.equal(target.value, defaultDateString);
            assert.equal(target.valueAsDate.toUTCString(), defaultDate.toUTCString());
        });

        it("binds to object literal", () => {

            const vm = setup(defaultDate, `<input type="text" v-model-date="{ value: myDate }"/>`).$mount();

            const target = <HTMLInputElement>vm.$el;

            assert.equal(target.value, defaultDateString, target.tagName);
            assert.equal(target.valueAsDate.toUTCString(), defaultDate.toUTCString());
        });

        it("updates prop when target element native 'change' event is fired", () => {

            const vm = setup(defaultDate, templateInputTextCustom).$mount();

            const target = <HTMLInputElement>vm.$el;
            target.value = '15-09-2012';

            dispatchEvent(vm.$el, 'change');

            return vm.$nextTick().then(() => {
                assert.equal(vm.myDate.toString(), new Date(2012, 8, 15).toString(), target.value);
            });
        });

        it("emits the 'input' event after updating model props", (done) => {

            const dt = defaultDate;
            const newDate = new Date(2012, 0, 11);

            let onInput = (newValue) => {
                assert.equal(newDate.toString(), newValue.toString());
                assert.equal(vm.myDate.toString(), newValue.toString());
                done();
            };

            const vm = setup(dt, templateInputText)
                .$mount()
                .$on('input', onInput);

            const target = <HTMLInputElement>vm.$el;
            target.value = '2012-01-11';
            dispatchEvent(vm.$el, 'change');
        });

        it("only emits the 'input' event when date change occurs", () => {

            const vm = setup(defaultDate, `<input type="text" v-model-date="{ value: myDate }"/>`).$mount();

            const target = <HTMLInputElement>vm.$el;
            target.value = defaultDateString;

            let emitted = false;
            var message = '';

            vm.$on('input', () => emitted = true);

            dispatchEvent(vm.$el, 'change');

            return vm.$nextTick().then(() => {
                assert.isNotTrue(emitted, 'An input event was emitted by the directive');
            });
        });

        it("accepts custom format string", () => {

            const dateString = '13-01-2011';
            const vm = setup(defaultDate, templateInputTextCustom).$mount();

            const target = <HTMLInputElement>vm.$el;

            assert.equal(target.value, dateString);
            assert.equal(target.valueAsDate.toUTCString(), defaultDate.toUTCString());
        });

        it("parses custom format string", () => {

            const vm = setup(defaultDate, templateInputTextCustom).$mount();

            const target = <HTMLInputElement>vm.$el;
            target.value = '15-09-2012';

            dispatchEvent(vm.$el, 'change');

            return vm.$nextTick().then(() => {
                assert.equal(vm.myDate.toString(), new Date(2012, 8, 15).toString(), target.value);
            });
        });
    });

    describe("input.type === 'date'", () => {

        it("binds to vm property", () => {

            const vm = setup(defaultDate, templateInputDate).$mount();

            const target = <HTMLInputElement>vm.$el;

            assert.equal(target.value, defaultDateString);
            assert.equal(target.valueAsDate.toUTCString(), defaultDate.toUTCString());
        });

        it("binds to vm object", () => {

            let vm = new Vue({
                template: `<input type="date" v-model-date="settings"/>`,
                directives: {
                    'model-date': VueModelDate
                },
                data: () => {
                    return {
                        from: defaultDate,
                        settings: {
                            value: 'from'
                        }
                    }
                }
            }).$mount();

            const target = <HTMLInputElement>vm.$el;

            assert.equal(target.value, defaultDateString);
            assert.equal(target.valueAsDate.toUTCString(), defaultDate.toUTCString());
        });

        it("binds to object literal", () => {

            const vm = setup(defaultDate, `<input type="date" v-model-date="{ value: myDate }"/>`).$mount();

            const target = <HTMLInputElement>vm.$el;

            assert.equal(target.value, defaultDateString);
            assert.equal(target.valueAsDate.toUTCString(), defaultDate.toUTCString());
        });

        it("updates prop when target element native 'change' event is fired", () => {

            const newDate = new Date(2012, 0, 11);
            const vm = setup(defaultDate, templateInputDate).$mount();

            const target = <HTMLInputElement>vm.$el;
            target.value = '2012-01-11';

            dispatchEvent(vm.$el, 'change');

            return vm.$nextTick().then(() => {
                assert.equal(vm.myDate.toString(), newDate.toString());
            })
        });

        it("emits the 'input' event after updating model props", (done) => {

            const dt = defaultDate;
            const newDate = new Date(2012, 0, 11);

            let onInput = (newValue) => {
                assert.equal(newDate.toString(), newValue.toString());
                assert.equal(vm.myDate.toString(), newValue.toString());
                done();
            };

            const vm = setup(dt, templateInputDate)
                .$mount()
                .$on('input', onInput);

            const target = <HTMLInputElement>vm.$el;
            target.value = '2012-01-11';
            dispatchEvent(vm.$el, 'change');
        });

        it("only emits the 'input' event when date change occurs", () => {

            const vm = setup(defaultDate, `<input type="date" v-model-date="{ value: myDate }"/>`).$mount();

            const target = <HTMLInputElement>vm.$el;
            target.value = defaultDateString;

            let emitted = false;
            var message = '';

            vm.$on('input', () => emitted = true);

            dispatchEvent(vm.$el, 'change');

            return vm.$nextTick().then(() => {
                assert.isNotTrue(emitted, 'An input event was emitted by the directive');
            });
        });
    });

    describe('directive hooks', () => {

        VueModelDateHooks.forEach(hookName => {

            it(`the hook '${hookName}' is called`, () => {

                let hookCalled = false;
                let settings = new Object();

                Object.defineProperty(settings, 'value', {
                    configurable: true,
                    enumerable: true,
                    value: 'from',
                    writable: true
                })

                Object.defineProperty(settings, 'pattern', {
                    configurable: true,
                    enumerable: true,
                    value: 'DD-MM-YYYY',
                    writable: true
                });

                Object.defineProperty(settings, hookName, {
                    configurable: true,
                    enumerable: true,
                    value: () => hookCalled = true,
                    writable: true
                });

                let vm = new Vue({
                    template: `<input type="text" v-model-date="settings"/>`,
                    directives: {
                        'model-date': VueModelDate
                    },
                    data: () => {
                        return {
                            from: defaultDate,
                            settings: settings
                        }
                    }
                }).$mount();

                const target = <HTMLInputElement>vm.$el;
                target.value = '28-02-2012';
                dispatchEvent(vm.$el, 'change');

                return vm.$nextTick().then(() => {
                    assert.isTrue(hookCalled, `The hook '${hookName}' was not called`);
                });
            });

        });
    })

    describe('other', () => {

        it("adds 'hasNativeSupport' prop to dataset of target element", () => {

            const vm = setup(defaultDate, templateInputDate).$mount();

            const target = <HTMLInputElement>vm.$el;

            assert.isTrue(target.dataset.hasNativeSupport === '0' || target.dataset.hasNativeSupport === '1');
        });

        it("sets model value to null when value is cleared", () => {

            const vm = setup(defaultDate, templateInputDate).$mount();

            const target = <HTMLInputElement>vm.$el;
            target.value = ''; // value has been cleared

            dispatchEvent(vm.$el, 'change');

            return vm.$nextTick().then(() => {
                assert.isNull(vm.myDate);
            });
        });
    })
});
