import { ClientNetwork } from "../../client/client_network.h.js";

const client = new ClientNetwork("localhost", 3030)
client.messageHandler.addEventListener('connected', () => {
    console.log('we have connected to server!')
})