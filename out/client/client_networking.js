// import WebSocket from "ws";
import { EventHandler, Message } from "../both/classes.h.js";
const ws = new WebSocket('ws://localhost:3030');
ws.onopen = (openEv) => {
};
const MessageHandler = new EventHandler();
MessageHandler.addEventListener('connected', () => {
    console.log('we have connected to server');
});
ws.onmessage = (message) => {
    console.log('Received message');
    const msg = JSON.parse(message.data);
    ws.send(new Message('new', ['testing']).ToString());
    MessageHandler.emit(msg.action, msg.data);
};
export { ws, MessageHandler };
