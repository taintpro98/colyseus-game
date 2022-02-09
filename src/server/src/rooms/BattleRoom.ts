import { Room, Client } from "colyseus";
import { BattleState } from "./schema/BattleState";
import { Player } from "../entities/Player";

export class BattleRoom extends Room<BattleState> {
    onCreate() {
        this.setState(new BattleState());
        console.log("fuckkkk");
        this.onMessage("action", (client, message) => {
            console.log("dammmmmm");
            console.log(client.sessionId, "sent 'action' message: ", message);
        });
    }

    onJoin(client: Client, options: { playerName: string }) {
        const player = new Player();
        player.name = `Player ${this.clients.length}`;
        player.position.x = Math.random();
        player.position.y = Math.random();

        this.state.players.set(client.sessionId, player);
        // console.log("sessionId", client.sessionId);
        // console.log("id", client.id);
        // console.log("playerName", options.playerName);
    }

    onLeave(client: Client){
        this.state.players.delete(client.sessionId);
    }
}