class IRoom {
    constructor(clients = new Set()) {
        this.clients = new Set();
        this.clients = new Set(clients); // create a copy of the set
    }
    addClient(client) {
        if (this.clients.has(client))
            return false;
        this.clients.add(client);
        return true;
    }
    removeClient(client) {
        return this.clients.delete(client);
    }
    broadcast(data, exclude = []) {
        this.clients.forEach((ws) => {
            if (!exclude.includes(ws))
                ws.send(data);
        });
    }
}
export { IRoom };
