import path from "path";
import http from "http";
import express from "express";
import cors from "cors";
import { Server, RedisPresence } from "colyseus";
import { MongooseDriver } from "@colyseus/mongoose-driver"
import { monitor } from "@colyseus/monitor";

import { BattleRoom } from "./rooms/BattleRoom";

export const port = Number(process.env.PORT || 2567);
const app = express();

app.use(cors());
app.use(express.json());
app.use("/colyseus", monitor());
// app.use(express.static(path.join(__dirname, "..", "..", "client", "dist")));

// Create HTTP & WebSocket servers
const server = http.createServer(app);
const gameServer = new Server({
    server: server,
    // driver: new MongooseDriver()
});

gameServer.define("game", BattleRoom);

server.listen(port);
console.log(`Listening on ${ port }`)