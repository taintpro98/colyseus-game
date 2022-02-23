import { Room, Client } from "colyseus.js";
import { EMessagePVERoom } from "./types";

export function requestJoinOptions(this: Client, i: number) {
    return { requestNumber: i };
}

export async function onJoin(this: Room) {
    console.log(this.sessionId, "joined.");
    // setInterval(() => {
    //     this.send(EClientMessageType.StartTurn, { skill_info: 1 });
    // }, 10000);
    let clientState = {
        numNekos: 3,
        leftNekos: 3,
        ready: false,
        startRound: false,
        numTurns: 100
    }

    for (let iRound = 0; iRound < clientState.numTurns; iRound++) {
        for (let iTurn = 0; iTurn < clientState.numNekos; iTurn++) {
            this.send(EMessagePVERoom.StartTurn, { skill_info: 1 });
            await sleep(10000);
            this.send(EMessagePVERoom.Battle, { x: 1 });
        }
    }

    this.onMessage("*", (type, message) => {
        switch (type) {
            case EMessagePVERoom.Ready:
                console.log("ready");
                clientState.ready = true;
                break;
            case EMessagePVERoom.StartRound:
                console.log("start-round", message);
                clientState.startRound = true;
                if(clientState.leftNekos > 0) playTurn();
                break;
            case EMessagePVERoom.CalculateQueue:
                console.log("queue", message);
                break;
            case EMessagePVERoom.Battle:
                console.log("result", message);
                console.log("animation");
                // await sleep(10000);
                // this.send(EMessagePVERoom.EndTurn, { x: 1 });
                break;
            case EMessagePVERoom.EndTurn:
                clientState.leftNekos--;
                console.log("endturn", message);
                if(clientState.leftNekos > 0) playTurn();
                break;
            case EMessagePVERoom.EndRound:
                console.log("endround", message);
                break;
            default:
                console.log("default");
        }
    });

}

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function playTurn() {
    this.send(EMessagePVERoom.StartTurn, { skill_info: 1 });
    await sleep(15000);
    this.send(EMessagePVERoom.Battle, { x: 1 });
}

export async function onLeave(this: Room) {
    console.log(this.sessionId, "left.");
    // this.connect("ws://localhost:2567");
    // try {
    //     const room = await Client.reconnect(this.id, this.sessionId);
    //     console.log("joined successfully", room);

    // } catch (e) {
    //     console.error("join error", e);
    // }
}

export function onError(this: Room, err) {
    console.error(this.sessionId, "!! ERROR !!", err.message);
    this.connect("ws://localhost:2567");
}

export function onStateChange(this: Room, state) {
}