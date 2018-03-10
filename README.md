# vue-model-date
This is a helper directive, that provides functionality similar to [v-model](https://vuejs.org/v2/api/#v-model) for handling binding between 

* date model properties __and__
* html input elements of type date or string

## Installation
```bash
$ npm install --save-dev vue-model-date
```

## Usage
Import the directive into each component as required, or register globally. The [date-fns](https://github.com/date-fns/date-fns) library is used for formatting and parsing. If model property being bound to also contains a time portion, this will remain intact

Most default behaviour can be over-ridden by providing hook function as options when binding

## Directive Options
Binding options recognized by the directive

<table>
<thead><tr><th>Name</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
<tbody>
    <tr>
        <td>value</td><td>String | Date</td><td>Y</td><td><p>identifies the model property to bind to</p></td>
    </tr>
    <tr>
        <td>pattern</td><td>String</td><td>N</td>
        <td>
            <p>used for parsing and formatting. defaults to <i>'YYYY-MM-DD'</i></p>
            <p>see <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date">[link]</a></p>
        </td>
    </tr>
    <tr>
        <td>adjustDate</td><td>Function(Date,Date) : Date | Null </td><td>N</td>
        <td>
            <p>if the date portion of provided args is different, then return (arg2) +/- days</p>
            <p>if the date portion of provided args is the same, then return null</p>
        </td>
    </tr>
    <tr>
        <td>equal</td><td>Function(Date,Date) : Boolean</td><td>N</td>
        <td>
            <p>perform an equality check on the date portion of the provided args</p>
        </td>
    </tr>
    <tr>
        <td>parse</td><td>Function(String,String) : Date</td><td>N</td>
        <td>
            <p>parse the provided string (arg1) using the specified pattern (arg2)</p>
        </td>
    </tr>
    <tr>
        <td>format</td><td>Function(Date,String) : String</td><td>N</td>
        <td>
            <p>format the provided date (arg1) using the specified pattern (arg2)</p>
        </td>
    </tr>
</tbody>
</table>

## Examples
These assume you have registered the directive similar to below
```
import { Vue } from 'vue';
import { VueModelDate } from 'vue-model-date';

new Vue({
    template: ...,
    directives: {
        'model-date': VueModelDate
    },
    data: () => { return { myDate: date } }
})
```

## Usage
If the browser has native support for date input controls, then usage is straight forward. The directive will ignore any custom formatting in this scenario, as the default is sufficient.

### simple
binds to a model property. This assumes the browser has native support for date input controls.

```html
<input type="date" v-model-date="myDate"/>
```

```js
data: function() {
    return { myDate: new Date() };
}
```

### binding to an object literal for options
binds to the object literal provided. Below specifies an optional formatting pattern, to be  used if the browser does not have native support for date control

```html
<input type="date" v-model-date="{ value: myDate, pattern: 'MM-DD-YYYY' }"/>
```

```js
data: function() {
    return { myDate: new Date() };
}
```

### bind to model property for options

binds to a model property. When using this syntax, you must supply a string for the __value__ property)

```html
<input type="date" v-model-date="opts"/>
```

```js
data: function() {
    return {
        myObject: {
            myDate: new Date()
        },
        opts : {
            value: 'myObject.myDate' // binding expression to identify the model property,
            pattern: 'MM-DD-YYYY' // custom parse/format pattern
        }
    };
}
```

### no native support
If the browser does not have native support for date input, it will degrade to a text input. In this scenario, a property 'hasNativeSupport' will be added to the dataset of HTML element.

You should then further restrict user input by conditionally adding 'pattern' to the element as shown below

```html
<input type="text" v-model-date="opts" :pattern="($el.dataset.hasNativeSupport ? false : opts.validator)" />
```

```js
data: function() {
    return {
        myDate: new Date(),
        opts : {
            value: 'myDate', // binding expression to identify the model property,
            pattern: 'MM-DD-YYYY', // custom parse/format pattern
            validator: '[0-9][0-9]-[0-9][0-9]-[0-9][0-9][0-9][0-9]' // the custom regex string to be used for fallback scenario
        }
    };
}
```

### custom hooks
the example below supplies a custom function hook for equality checking (performed after UI changes occur). when you provide a hook, the context of __this__ object will be the _directive instance_ 

```html
<input type="date" v-model-date="opts"/>
```

```js
data: function(){
    return {
        myDate: new Date(),
        opts : {
            value: 'myDate' // note use of string as binding expression,
            equal: (oldValue,newValue) => {
                // ... customize how the equality comparison is done
                return true;
            }
        }
    };
}
```

## Authors
* [mrellipse](https://github.com/mrellipse)

## Contributing
There are no plans to alter/change this code (besides any bug fixes)

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgments
* [vuejs.org](https://vuejs.org/v2)
* [date-fns.org](https://date-fns.org/)