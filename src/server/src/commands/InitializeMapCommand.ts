import { Command } from '@colyseus/command';
import { BattleRoom } from '../rooms/BattleRoom';

type Payload = {
    // client: Client,
}

export default class InitializeMapCommand extends Command<BattleRoom, Payload> {
    async execute(data: Payload) {
        //TODO: Load enemy, maplevel, ...
        // let userInfo = await this.userService.findById("32e1e686-8e3e-11ec-b909-0242ac120002");

        // Query from enemy_skills & enemies
        let enemies = [{
            id: 'b425aa64-7608-4ee7-a3e2-f5ecaf9427af',
            name: 'Enemy-0',
            element_id: 1,
            class_id: 1,
            strategy: "Algorithm-0",
            map_level_id: "49335f4c-e646-454d-8193-976c1e0683f3",
            metadata: { "atk": 722, "def": 541, "speed": 2, "health": 1144 },
            skills: [{
                id: "8ac3fc25-fa6c-4fe5-91ce-787bfe5d36fe",
                name: "Enemy-Skill-1",
                metadata: { "atk": 531, "def": 217, "speed": 4 },
            }, {
                id: "98f3ef63-d129-4652-ac7a-9c90c9b8d601",
                name: "Enemy-Skill-2",
                metadata: { "atk": 457, "def": 673, "speed": 5 },
            }],
            created_at: "2022-02-16T08:26:12.204Z",
            updated_at: "2022-02-16T08:26:12.204Z",
            deleted_at: "2022-02-16T08:26:12.204Z"
        }, {
            id: 'd511f2d9-a737-4957-ab20-2b81de796622',
            name: 'Enemy-1',
            element_id: 1,
            class_id: 1,
            strategy: "Algorithm-1",
            map_level_id: "f0832901-8a85-4bc5-a78c-c8d4fb612fc8",
            metadata: { "atk": 411, "def": 668, "speed": 4, "health": 1942 },
            skills: [{
                id: "8ac3fc25-fa6c-4fe5-91ce-787bfe5d36fe",
                name: "Enemy-Skill-1",
                metadata: { "atk": 531, "def": 217, "speed": 4 },
            }, {
                id: "63ebe487-d326-47ae-bd78-c25a0fde4d66",
                name: "Enemy-Skill-2",
                metadata: { "atk": 490, "def": 498, "speed": 5 },
            }],
            created_at: "2022-02-16T08:26:12.204Z",
            updated_at: "2022-02-16T08:26:12.204Z",
            deleted_at: "2022-02-16T08:26:12.204Z"
        }, {
            id: '74e76b92-8d5e-4b8c-afeb-8a5c39a8917e',
            name: 'Enemy-2',
            element_id: 1,
            class_id: 1,
            strategy: "Algorithm-2",
            map_level_id: "cb4af4b9-dd94-48df-9ad0-36088c00ea58",
            metadata: { "atk": 649, "def": 499, "speed": 8, "health": 1942 },
            skills: [{
                id: "8ac3fc25-fa6c-4fe5-91ce-787bfe5d36fe",
                name: "Enemy-Skill-3",
                metadata: { "atk": 594, "def": 405, "speed": 4 },
            }],
            created_at: "2022-02-16T08:26:12.204Z",
            updated_at: "2022-02-16T08:26:12.204Z",
            deleted_at: "2022-02-16T08:26:12.204Z"
        }];

        // enemies.map(enemy => {
        //     const { id, name, strategy, metadata, skills } = enemy;
        //     this.room.state.enemies.set(id, new EnemyEntity(id, name, strategy, metadata, skills));
        // });
        console.log("Initialize map");

        // this.room.broadcastMessage<any>({
        //     type: EMessagePVERoom.Joined,
        //     status: true,
        //     timestamp: Date.now(),
        //     params: { enemies },
        // });
    }
}
