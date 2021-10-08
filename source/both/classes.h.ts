/**
 * Register and Emit events within an instance
 * 
 */
class EventHandler{
    listeners : Map<string, Function[]>

    /**
     * Creates an EventHandler which can register and emit events
     */
    constructor(){
        this.listeners = new Map<string, Array<Function>>()
    }

    /**
     * Adds the function as an event listener
     * @param type what event name to register to
     * @param callback function/s to call
     */
    addEventListener(type : string, callback : Function){
        if (!this.listeners.has(type)){
            this.listeners.set(type, []); //No event with this name => Add new array of functions
        }
        this.listeners.get(type)?.push(callback);
    }

    /**
     * Remove the function as an event listener
     * @param type what event name to remove it from
     * @param callback function/s to remove
     */
    removeEventListener(type : string, callback : Function){
        if(!this.listeners.has(type)) //No event with this name
            return;
        
        let funcs = this.listeners.get(type)!;
        let i = funcs.indexOf(callback)
        funcs.splice(i, 1)
        this.listeners.set(type, funcs);
    }

    /**
     * Calls the event registered under given type as event(data)
     * @param type what emit event we call
     * @param data data to pass to event argument
     */
    emit(type : string, ...data : any[]){
        if(!this.listeners.has(type)) // No Event with this name
            return;
        if(data != null){
            this.listeners.get(type)?.forEach((func) => {func.call(this, ...data)}) //call all functions
        }
        else{
            this.listeners.get(type)?.forEach((func) => {func.call(this)}) //call all functions
        }
    }
}

// We want each of our messages to have structure: {action : 'action', data : {}}
/**
 * WebSocket Message Structure
 */
interface IMessage {
    /**
     * the event to call once passed sent
     */
    action : string;
    /**
     * the argument to pass into the event
     */
    data : any;
}

/**
 * Interface for ToString() convertible objects
 */
interface IToString {
    /**
     * Convert object to string
     */
    ToString() : string
}

/**
 * Implementation of IMessage with IToString with JSON
 */
class Message implements IMessage, IToString{
    action: string;
    data: any;
    /**
     * Creates a new WebSocket Message
     * @param action Event name
     * @param data arg to give the event call
     */
    constructor(action : string, data : any = null){
        this.action = action;
        this.data = data;
    }
    ToString(): string {
        return JSON.stringify(this)
    }
}

/**
 * 
 */
abstract class AbstractGame extends EventHandler {
    constructor(){
        super()
    }
}

export { AbstractGame, EventHandler, IMessage, Message }