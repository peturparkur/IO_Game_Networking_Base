import express from "express";
import path from "path";
import http from "http";
import { WebSocketServer } from 'ws';
import { EventHandler, Message } from "../both/classes.h.js";
// UTILITY
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = process.env.Port || 3030;
app.set("port", port);
const server = new http.Server(app); //create http server
const wss = new WebSocketServer({ 'server': server }); //create websocket server
// if we go to homepage -> express return these files
console.log('client files located on: ' + path.join(__dirname, "../client/"));
console.log('__dirname ', __dirname);
app.use('/client/', express.static(path.join(__dirname, "../client/"))); //add the client files to online
app.use('/both/', express.static(path.join(__dirname, "../both/"))); //add the client files to online
// what to do when someone goes to the given address
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});
const msgHandler = new EventHandler();
// WebSocket stuff
wss.on('connection', (ws, req) => {
    ws.on('message', (data, isBinary) => {
        console.log(`Received message: ${data}`);
        const msg = JSON.parse(data.toString());
        console.log(typeof (msg));
        console.log(msg);
        msgHandler.emit(msg.action, msg.data);
    });
    ws.send(new Message('connected').ToString());
});
server.listen(port, () => {
    console.log('Server is listening on ' + port);
});
