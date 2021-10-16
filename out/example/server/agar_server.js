import { BaseServer } from '../../server/server_setup.js';
//import { fileURLToPath } from 'url';
//import { dirname } from 'path';
//const __filename = fileURLToPath(import.meta.url);
//const __dirname = dirname(__filename);
const port = process.env.Port || 3030;
const agarServer = new BaseServer(parseInt(port.toString()));
agarServer.StartServer();
