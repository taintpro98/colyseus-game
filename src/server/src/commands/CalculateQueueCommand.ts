import { Command } from "@colyseus/command";
import { BattleRoom } from '../rooms/BattleRoom';

export default class CalculateQueueCommand extends Command<BattleRoom> {
    // private calculateSpeed(item: NekoEntity | EnemyEntity) {
    //     return item.currMetadata.speed;
    // }
    execute() {
        // if (!this.room.state.currentQueueInRound.length) {
        //     const enemies = [...this.room.state.enemies.values()].map((item) => ({
        //         type: EEntityTypePvERoom.ENEMY,
        //         id: item.id,
        //     }));
        //     const nekos = [...this.room.state.nekos.values()].map((item) => ({
        //         type: EEntityTypePvERoom.NEKO,
        //         id: item.id,
        //     }));
        //     this.room.state.currentQueueInRound = [...enemies, ...nekos];
        // }
        // let currentMaxIndex: number = -1;
        // let maxSpeed: number = 0;
        // this.room.state.currentQueueInRound.forEach((item, index) => {
        //     let entity: NekoEntity | EnemyEntity;
        //     if (item.type === EEntityTypePvERoom.ENEMY) {
        //         entity = this.room.state.enemies.get(item.id);
        //     } else {
        //         entity = this.room.state.nekos.get(item.id);
        //     }

        //     // check speed and isAlive and it's not in current use entity
        //     if (
        //         this.calculateSpeed(entity) > maxSpeed &&
        //         entity.isAlive() &&
        //         !this.room.state.currentEntitiesUseInRound.includes(item.id)
        //     ) {
        //         currentMaxIndex = index;
        //     } else if (!entity.isAlive()) {
        //         this.room.state.currentEntitiesUseInRound.push(item.id);
        //     }
        // });
        // this.room.state.currentEntitiesUseInRound.push(
        //     this.room.state.currentQueueInRound[currentMaxIndex].id
        // );
        // const messageQueue: TResponseQueue = {
        //     index: currentMaxIndex,
        //     turns: this.room.state.currentQueueInRound,
        // };
        this.room.broadcast("CalculateQueue", "queue");
    }
}
