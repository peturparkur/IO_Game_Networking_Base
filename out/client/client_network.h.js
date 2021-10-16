import { EventHandler, Message } from "../both/classes.h.js";
// import { MessageHandler} from "./client_networking.js";
class ClientNetwork {
    constructor(address = "localhost", port) {
        this.messageHandler = new EventHandler(); //handling messages
        this.ws = new WebSocket(`ws://${address}:${port}`); //connection
        // Assuming messages are JSON with format {action : x, data : {}}
        this.ws.onmessage = (message) => {
            console.log('Received message!');
            const msg = JSON.parse(message.data);
            this.ws.send(new Message('new', ['testing']).ToString());
            this.messageHandler.emit(msg.action, msg.data);
        };
    }
}
export { ClientNetwork };
