import { Room, Client } from "colyseus.js";
import { Message } from "../src/types/messages";

export function requestJoinOptions(this: Client, i: number) {
    
    return { requestNumber: i };
}

export function onJoin(this: Room) {
    // console.log(this.sessionId, "joined.");
    let skill_info = {
        "pikachu": {
            "name": "attack",
            "skill_id": 1,
            "type": 0,
            "speed": 3,
            "metadata": "{\"damage\":3,\"blood\":-1}"
        },
        "doraemon": {
            "name": "attack",
            "skill_id": 1,
            "type": 0,
            "speed": 3,
            "metadata": "{\"damage\":3,\"blood\":-1}"
        },
        "optimus": {
            "name": "resume",
            "skill_id": 2,
            "type": 1,
            "speed": 4,
            "metadata": "{\"damage\":0,\"blood\":3}"
        }
    }
    let i = 0;
    setInterval(() => {
        i++;
        this.send(Message.PlayerSelection, { skill_info: skill_info });
    }, 10000);

    this.onMessage("*", (type, message) => {
        // console.log("onMessage:", type, message);
    });
}

// export function onMessage(message) {
//     console.log("fuckkkkkkkkkk");
// }

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