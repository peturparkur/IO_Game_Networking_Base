import express from "express"
import path from "path"
import http from "http"
import WebSocket, {WebSocketServer} from 'ws'
import { EventHandler, IMessage, Message} from "../both/classes.h.js"

// UTILITY
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class BaseServer{
    port : number;
    app : express.Express
    server : http.Server;
    wss : WebSocketServer;
    messageHandler : EventHandler

    constructor(port : number = 3030){
        this.port = port
        this.app = express()
        this.app.use('/client/', express.static(path.join(__dirname, "../client/"))) //add the client files to online
        this.app.use('/both/', express.static(path.join(__dirname, "../both/"))) //add the client files to online
        this.app.use('/example/client/', express.static(path.join(__dirname, "../example/client/"))) //add the client files to online

        this.app.get("/", (req, res) => {
            res.sendFile(path.join(__dirname, "index.html"))
        })

        this.messageHandler = new EventHandler()

        this.server = new http.Server(this.app)
        this.wss = new WebSocketServer({'server' : this.server})

        this.wss.on('connection', (ws, req) => {
            ws.on('message', (data, isBinary) =>{
                console.log(`Received message: ${data}`)
                const msg = JSON.parse(data.toString()) as Message
                this.messageHandler.emit(msg.action, msg.data)
            })
            ws.send(new Message('connected').ToString())
        })
    }

    RegisterEventListener(eventName : string, callback : Function){
        this.messageHandler.addEventListener(eventName, callback)
    }

    ClearEvent(eventName : string){
        return this.messageHandler.clearEvent(eventName)
    }

    RemoveEventListener(eventName : string, callback : Function){
        this.messageHandler.removeEventListener(eventName, callback)
    }

    EmitEvent(eventName : string, ...data : any[]){
        this.messageHandler.emit(eventName, ...data)
    }

    StartServer(port : number | null = null){
        if(port != null) this.port = port
        this.server.listen(this.port, () =>{
            console.log('Server is listening on ' + this.port)
        })
    }
}

function CreateServer(port : number = 3030, client_files_loc = path.join(__dirname, "../client/"), both_files_loc = path.join(__dirname, "../both/")){
    const app = express()
    app.set("port", port)

    const server = new http.Server(app) //create http server
    const wss = new WebSocketServer({'server' : server}) //create websocket server

    //app.use('/client/', express.static(path.join(__dirname, "../client/"))) //add the client files to online
    app.use('/client/', express.static(client_files_loc))
    app.use('/both/', express.static(both_files_loc))
    //app.use('/both/', express.static(path.join(__dirname, "../both/"))) //add the client files to online

    // what to do when someone goes to the given address
    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, "index.html"))
    })

    const MessageHandler = new EventHandler()

    // WebSocket stuff
    wss.on('connection', (ws, req) => {
        ws.on('message', (data, isBinary) =>{
            console.log(`Received message: ${data}`)
            const msg = JSON.parse(data.toString()) as Message
            MessageHandler.emit(msg.action, msg.data)
        })
        ws.send(new Message('connected').ToString())
    })
    server.listen(port, () =>{
        console.log('Server is listening on ' + port)
    })

    return [app, server, wss, MessageHandler]
}

export { CreateServer, BaseServer }