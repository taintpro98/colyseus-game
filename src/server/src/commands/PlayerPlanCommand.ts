import { Command } from '@colyseus/command';
import { EEntityTypePvERoom } from '@n-constants/enums';
import PvERoom from '@n-rooms/PvERoom';
import { EnemyEntity, NekoEntity } from '@n-schemas/entities';
import { TPlanningInfoPVERoom, EMessagePVERoom, TStateResponse, TState } from '@n-types/pverooms';

export default class PlayerPlanCommand extends Command<PvERoom, TPlanningInfoPVERoom[]> {

    private calculateSpeedNeko(neko_id: string) {
        const neko = this.room.state.nekos.get(neko_id);
        return (neko.metadata.atk + neko.metadata.def) / 2 * neko.metadata.speed
    }

    private calculateSpeedEnemy(enemy_id: string) {
        const enemy = this.room.state.enemies.get(enemy_id);
        return (enemy.metadata.atk + enemy.metadata.def) / 2 * enemy.metadata.speed
    }


    async execute(plan: TPlanningInfoPVERoom[]) {

        // Map skill& item to neko
        console.log("map skills item to neko")
        plan.map(dt => {
            if (this.room.state.nekos.has(dt.nekoId)) {
                let neko: NekoEntity = this.room.state.nekos.get(dt.nekoId);
                neko.currTargetEnemies = dt.targets.filter(item => item.entity_type === EEntityTypePvERoom.ENEMY).map((element) => this.room.state.enemies.get(element.id))
                neko.currTargetNekos = dt.targets.filter(item => item.entity_type === EEntityTypePvERoom.NEKO).map((element) => this.room.state.nekos.get(element.id))
                if (dt.skillId) {
                    if (dt.itemId) {
                        //TODO: catch error
                        this.room.broadcastMessage<any>({
                            type: EMessagePVERoom.Planned,
                            status: false,
                            timestamp: Date.now(),
                            params: {},
                        });
                    }
                    else {
                        //TODO: Set skill for neko
                        neko.currSkill = neko.skills.get(dt.skillId);
                    }
                }
                else {
                    if (dt.itemId) {
                        neko.currConsumption = this.state.consumptionItems.get(dt.itemId);

                        // should remove ??
                        this.room.state.consumptionItems.delete(dt.itemId);
                    }
                }
                this.room.state.nekos.set(dt.nekoId, neko);
            }
        });

        // initial strategy for enemy
        console.log("initial enemies for room state");
        [...this.room.state.enemies.keys()].forEach((key, index) => {
            console.log("key enemy: ", key)
            let enemy = this.room.state.enemies.get(key);
            enemy.strategyMethod([...this.room.state.nekos.values()]);
            this.room.state.enemies.set(key, enemy);
        })
        console.log("initial while")
        let queue: TStateResponse[] = []
        let usedEntityIds: string[] = []

        while (true) {
            console.log("test: ")
            // If no neeed update queue when met dead entity
            let nekoValues = [...this.room.state.nekos.values()].filter(item => !usedEntityIds.includes(item.id) && item.isAlive()).map((item) => ({ entity_type: EEntityTypePvERoom.NEKO, ...item }));
            let enemyValues = [...this.room.state.enemies.values()].filter(item => !usedEntityIds.includes(item.id) && item.isAlive()).map((item) => ({ entity_type: EEntityTypePvERoom.ENEMY, ...item }));
            console.log("neko filter: ")
            if (nekoValues.length === 0 && enemyValues.length === 0) {
                console.log("llllllllll");
                break;
            }

            // Find max speed entity
            let currEntity = [...nekoValues, ...enemyValues].reduce((a, b) => a.currMetadata.speed > b.currMetadata.speed ? a : b);


            usedEntityIds.push(currEntity.id);


            // let nekoValues = [...this.room.state.nekos.values()].filter(item => !usedEntityIds.includes(item.id)).map((item) => ({ entity_type: EEntityTypePvERoom.NEKO, ...item }));
            // let enemyValues = [...this.room.state.enemies.values()].filter(item => !usedEntityIds.includes(item.id)).map((item) => ({ entity_type: EEntityTypePvERoom.ENEMY, ...item }));
            // let entites = [...nekoValues, ...enemyValues];
            // // Sort origin entity( neko,enemy) by speed
            // entites = entites.sort((b, a) => {
            //     return a.currMetadata.speed - b.currMetadata.speed;
            // });

            // // check enetity has been alive
            // let currEntity;
            // for (let i = 0; i < entites.length; i++) {
            //     if (!entites[i].isAlive) {

            //         usedEntityIds.push(entites[i].id)
            //         queue.push({ source: { id: entites[i].id, entity_type: entites[i].entity_type } })
            //     }
            //     else {
            //         currEntity = entites[i];
            //         break
            //     }
            // }


            // process with targets
            if (currEntity.entity_type === EEntityTypePvERoom.NEKO) {
                // curr this turn (the point just be changed in current turn when use skill or item ???)
                let currAtkTurn: number = currEntity.currMetadata.atk;
                let currDefTurn: number = currEntity.currMetadata.def;
                console.log("test process: ", currEntity.isAlive())


                // Update metadata when use skill or item this turn
                let currNeko = currEntity as unknown as NekoEntity;
                console.log(currNeko.isAlive())

                // USE SKILL
                if (currNeko.currSkill) {

                    //TODO Need skill_type to write the logic how this skill affect to enemies or nekos???. Now baseon functionName
                    switch (currNeko.currSkill.metadata.functionName) {
                        case "":
                            break;
                        default:
                            // Skill just help to increase atk, def by self and affect to enemies. 
                            if (currNeko.currTargetEnemies) {
                                currNeko.currTargetEnemies.forEach(e => {
                                    currAtkTurn += currNeko.currSkill.metadata.atk;
                                    currDefTurn += currNeko.currSkill.metadata.def;
                                    e.currMetadata.health -= (currAtkTurn - e.currMetadata.def) > 0 ? currAtkTurn - e.currMetadata.def : 0
                                    this.room.state.enemies.set(e.id, e);
                                });
                                // Example if some metadata need to update ???
                                currNeko.updateCurrMetadata("def", currDefTurn);
                                currNeko.updateCurrMetadata("atk", currAtkTurn);
                                this.room.state.nekos.set(currNeko.id, currNeko);
                            }
                            else {
                                //TODO: catch error
                            }
                            break;
                    }
                }


                // USE ITEM
                else if (currNeko.currConsumption) {
                    switch (currNeko.currConsumption.metadata.functionName) {
                        case "":
                            if (currNeko.currTargetEnemies) {
                                currNeko.currTargetEnemies.forEach(e => {
                                    currAtkTurn += currNeko.currConsumption.metadata.damage;
                                    e.currMetadata.health -= (currAtkTurn - e.currMetadata.def) > 0 ? currAtkTurn - e.currMetadata.def : 0
                                    this.room.state.enemies.set(e.id, e);
                                });
                            }
                            else {
                                //TODO: catch error
                            }
                            break;
                        default:
                            if (currNeko.currTargetNekos) {
                                currNeko.currTargetNekos.forEach(item => {
                                    item.currMetadata.atk += currNeko.currConsumption.metadata.damage;
                                    // test speed
                                    item.currMetadata.speed += currNeko.currConsumption.metadata.damage * 0.8;
                                    this.room.state.nekos.set(item.id, item);
                                });
                            }
                            else {
                                //TODO: catch error
                            }
                            break;
                    }
                }

                // USE DEFAULT
                else {
                    if (currNeko.currTargetEnemies) {
                        currNeko.currTargetEnemies.forEach(e => {
                            e.metadata.health -= (currAtkTurn - e.currMetadata.def) > 0 ? currAtkTurn - e.currMetadata.def : 0
                            this.room.state.enemies.set(e.id, e);
                        });
                    }
                }

                // update queue to send client messages => send state of all targets
                let response: TStateResponse = { source: { id: currNeko.id, entity_type: EEntityTypePvERoom.NEKO } }
                let targets: TState[] = []
                if (this.room.state.nekos.get(currNeko.id).currTargetNekos.length) {
                    this.room.state.nekos.get(currNeko.id).currTargetNekos.forEach((item) => {
                        targets.push({ e: { id: item.id, entity_type: EEntityTypePvERoom.NEKO }, metadata: { health: item.currMetadata.health, atk: item.currMetadata.atk, def: item.currMetadata.def, speed: item.currMetadata.speed } });
                    })
                }

                if (this.room.state.nekos.get(currNeko.id).currTargetEnemies.length) {
                    this.room.state.nekos.get(currNeko.id).currTargetEnemies.forEach((item) => {
                        targets.push({ e: { id: item.id, entity_type: EEntityTypePvERoom.ENEMY }, metadata: { health: item.currMetadata.health, atk: item.currMetadata.atk, def: item.currMetadata.def, speed: item.currMetadata.speed } });
                    })
                }
                response.targets = targets;
                queue.push(response);
            }

            if (currEntity.entity_type === EEntityTypePvERoom.ENEMY) {
                // curr index this turn 
                let currAtkTurn: number = currEntity.currMetadata.atk;
                let currDefTurn: number = currEntity.currMetadata.def;

                // Update metadata when use skill or item this turn
                let currEnemy = currEntity as unknown as EnemyEntity;
                console.log("test process: ", currEntity.isAlive())

                // USE SKILL
                if (currEnemy.currSkill) {
                    //TODO Need skill_type to write the logic how this skill affect to enemies or nekos???. Now baseon name ???
                    switch (currEnemy.currSkill.name) {
                        case "":
                            break;
                        default:
                            // Skill just help to increase atk, def by self and affect to enemies.
                            console.log("enemy use skill")
                            if (currEnemy.currTargetNekos) {
                                currEnemy.currTargetNekos.forEach(e => {
                                    console.log("update current attack turn")
                                    currAtkTurn += currEnemy.currSkill.metadata.atk;
                                    currDefTurn += currEnemy.currSkill.metadata.def;
                                    e.currMetadata.health -= (currAtkTurn - e.currMetadata.def) > 0 ? currAtkTurn - e.currMetadata.def : 0
                                    this.room.state.nekos.set(e.id, e);
                                });
                                // Example if some metadata need to update ????
                                currEnemy.updateCurrMetadata("def", currDefTurn);
                                currEnemy.updateCurrMetadata("atk", currAtkTurn);
                                this.room.state.enemies.set(currEnemy.id, currEnemy);
                            }
                            else {
                                //TODO: catch error
                            }
                            break;
                    }
                }

                // USE DEFAULT
                else {
                    if (currEnemy.currTargetNekos) {
                        currEnemy.currTargetNekos.forEach(e => {
                            e.metadata.health -= (currAtkTurn - e.currMetadata.def) > 0 ? currAtkTurn - e.currMetadata.def : 0
                            this.room.state.nekos.set(e.id, e);
                        });
                    }
                }

                // update queue to send client messages => send state of all targets
                let response: TStateResponse = { source: { id: currEnemy.id, entity_type: EEntityTypePvERoom.ENEMY } }
                let targets: TState[] = []

                if (this.room.state.enemies.get(currEnemy.id).currTargetNekos.length) {
                    this.room.state.enemies.get(currEnemy.id).currTargetNekos.forEach((item) => {
                        console.log("item for targets")
                        targets.push({ e: { id: item.id, entity_type: EEntityTypePvERoom.NEKO }, metadata: { health: item.currMetadata.health, atk: item.currMetadata.atk, def: item.currMetadata.def, speed: item.currMetadata.speed } });
                    })
                }
                // if (this.room.state.enemies.get(currEnemy.id).currTargetEnemies.length) {
                //     console.log("targets");

                //     this.room.state.enemies.get(currEnemy.id).currTargetEnemies.forEach((item) => {

                //         targets.push({ e: { id: item.id, entity_type: EEntityTypePvERoom.ENEMY }, metadata: { health: item.currMetadata.health, atk: item.currMetadata.atk, def: item.currMetadata.def, speed: item.currMetadata.speed } });
                //     })
                // }


                response.targets = targets;
                queue.push(response);
                queue.forEach(q => {
                    console.log("source: ---", q.source);
                    console.log("targets: ---");
                    q.targets.forEach((t => console.log(t)));
                })
                // console.log("queue: ", queue)
            }
        }

        //TODO: Reset all rating without health of entity
        // this.room.state.resetAllRatingWithoutHealth();

        //TODO: Handle consumption and skill which used this round. should send it to client ???

    }
}
