export function dispatchEvent(el: HTMLElement, name: string) {
    var event = document.createEvent('Event');
    event.initEvent(name, true, true);
    el.dispatchEvent(event);
}