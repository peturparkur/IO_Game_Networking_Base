class EventHandler {
    constructor() {
        this.listeners = new Map();
    }
    addEventListener(type, callback) {
        var _a;
        if (!this.listeners.has(type)) {
            this.listeners.set(type, []); //No event with this name => Add new array of functions
        }
        (_a = this.listeners.get(type)) === null || _a === void 0 ? void 0 : _a.push(callback);
    }
    removeEventListener(type, callback) {
        if (!this.listeners.has(type)) //No event with this name
            return;
        let funcs = this.listeners.get(type);
        let i = funcs.indexOf(callback);
        funcs.splice(i, 1);
        this.listeners.set(type, funcs);
    }
    emit(type, ...data) {
        var _a, _b;
        if (!this.listeners.has(type)) // No Event with this name
            return;
        if (data != null) {
            (_a = this.listeners.get(type)) === null || _a === void 0 ? void 0 : _a.forEach((func) => { func.call(this, ...data); }); //call all functions
        }
        else {
            (_b = this.listeners.get(type)) === null || _b === void 0 ? void 0 : _b.forEach((func) => { func.call(this); }); //call all functions
        }
    }
}
class Message {
    constructor(action, data = null) {
        this.action = action;
        this.data = data;
    }
    ToString() {
        return JSON.stringify(this);
    }
}
class AbstractGame extends EventHandler {
    constructor() {
        super();
    }
}
export { AbstractGame, EventHandler, Message };
