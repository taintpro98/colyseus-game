import {uWebSocketsTransport} from "@colyseus/uwebsockets-transport";
import { WebSocketTransport } from "@colyseus/ws-transport";
import http from "http";
import express from "express";
import cors from "cors";
import { monitor } from "@colyseus/monitor";

// const app = express();

// app.use(cors());
// app.use(express.json());
// // app.use("/colyseus", monitor());
// const server = http.createServer(app);

// const transportColyseus = new WebSocketTransport({
//     server: server
// });

const transportColyseus = new uWebSocketsTransport({
    /* options */
})

// transportColyseus.app.get("/*", (res, req) => {
//     res.writeStatus('200 OK').writeHeader('IsExample', 'Yes').end('Hello there!');
// });

export {
    transportColyseus
}