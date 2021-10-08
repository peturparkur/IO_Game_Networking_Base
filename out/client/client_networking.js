// import WebSocket from "ws";
import { EventHandler, Message } from "../both/classes.h.js";
const ws = new WebSocket('ws://localhost:3030');
ws.onopen = (openEv) => {
    console.log('opened');
};
const msgHandler = new EventHandler();
msgHandler.addEventListener('connected', () => {
    console.log('we have connected to server');
});
ws.onmessage = (message) => {
    console.log('Received message');
    console.log(`data: ${message}, ${message.data}`);
    const msg = JSON.parse(message.data);
    console.log(msg);
    ws.send(new Message('new', ['testing']).ToString());
    msgHandler.emit(msg.action, msg.data);
    // ws.send('test message')
};
export { ws };
