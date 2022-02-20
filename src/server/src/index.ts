import path from "path";
import http from "http";
import express from "express";
import cors from "cors";
import { Server } from "@colyseus/core";
import { monitor } from "@colyseus/monitor";
import { transportColyseus } from "./config/transport";
import { WebSocketTransport } from "@colyseus/ws-transport"

import { BattleRoom } from "./rooms/BattleRoom";

export const port = Number(process.env.PORT || 2567);
const app = express();

app.use(cors());
app.use(express.json());
// app.use("/colyseus", monitor());
// app.use(express.static(path.join(__dirname, "..", "..", "client", "dist")));

// Create HTTP & WebSocket servers
const server = http.createServer(app);
const gameServer = new Server({
    // server: server,
    transport: transportColyseus
});

gameServer.define("game", BattleRoom);
gameServer.listen(port).then(() => {
    console.log(`Listening on ${ port }`)
});
// server.listen(port);
// console.log(`Listening on ${ port }`)