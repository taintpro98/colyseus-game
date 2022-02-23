import { Command } from '@colyseus/command';
import { BattleRoom } from '../rooms/BattleRoom';
import { Client } from 'colyseus';

type Payload = {
    client: Client,
}

export default class PlayerJoinCommand extends Command<BattleRoom, Payload> {
    async execute(data: Payload) {
        let roomNekos = [{
            id: 'd70d9b92-3388-4a37-b044-cff19a1681b9',
            name: 'Neko-0',
            user_id: '37544975-eed4-4992-9f8c-0ddbeb012191',
            created_at: "2022-02-16T08:26:12.204Z",
            updated_at: "2022-02-16T08:26:12.204Z",
            deleted_at: "2022-02-16T08:26:12.204Z",
            metadata: { "atk": 658, "def": 690, "speed": 4, "health": 1774 },
            skills: [
                {
                    id: "303b8ad9-0193-4a3f-b5de-64d23a3db835",
                    metadata: { "function": "cover", "atk": 481, "speed": 4, "def": 686 },
                    name: "Skill-1",
                    neko_id: "6af6be78-ac09-405b-9d42-956eccb8e9ac",
                },
            ]
        }, {
            id: '7193102e-f16b-491f-9812-6e777b4956c3',
            name: 'Neko-1',
            user_id: '37544975-eed4-4992-9f8c-0ddbeb012191',
            created_at: "2022-02-16T08:26:12.204Z",
            updated_at: "2022-02-16T08:26:12.204Z",
            deleted_at: "2022-02-16T08:26:12.204Z",
            metadata: { "atk": 461, "def": 798, "speed": 5, "health": 1950 },
            skills: [
                {
                    id: "303b8ad9-0193-4a3f-b5de-64d23a3db835",
                    metadata: { "function": "cover", "atk": 481, "speed": 4, "def": 686 },
                    name: "Skill-1",
                    neko_id: "6af6be78-ac09-405b-9d42-956eccb8e9ac",
                },
            ]
        }, {
            id: '04ae24e2-1ff6-4f96-8812-313fb8d9241d',
            name: 'Neko-2',
            user_id: '37544975-eed4-4992-9f8c-0ddbeb012191',
            created_at: "2022-02-16T08:26:12.204Z",
            updated_at: "2022-02-16T08:26:12.204Z",
            deleted_at: "2022-02-16T08:26:12.204Z",
            metadata: { "atk": 685, "def": 799, "speed": 5, "health": 1045 },
            skills: [
                {
                    id: "303b8ad9-0193-4a3f-b5de-64d23a3db835",
                    metadata: { "function": "cover", "atk": 481, "speed": 4, "def": 686 },
                    name: "Skill-1",
                    neko_id: "6af6be78-ac09-405b-9d42-956eccb8e9ac",
                },
            ]
        }];

        // Query from user_consumption_items, consumption_items and consumption_item_types base on user_id
        const roomConsumptionItems = [{
            consumption_item_id: "b2bcf6c8-e7b6-4bca-882c-1a8720dfc284",
            total: 1,
            name: "consumption-item-1",
            consumption_item_type_id: "a6de04c4-d357-4886-b36b-2894a24886a1",
            metadata: { "background": "red", "damage": 180, "function": "cover-1" },
        }, {
            consumption_item_id: "78f9b800-be75-4cf1-9792-7ce9cdf674d2",
            total: 2,
            name: "consumption-item-2",
            consumption_item_type_id: "de86108d-660f-490c-b0a4-c4971af48ec0",
            metadata: { "background": "red", "damage": 121, "function": "cover-2" },
        }, {
            consumption_item_id: "19107f92-b6f5-4c6d-a8e2-f02acc166f24",
            total: 3,
            name: "consumption-item-3",
            consumption_item_type_id: "34037c76-a012-4251-9627-50f2478b69c3",
            metadata: { "background": "red", "damage": 129, "function": "cover-3" },
        }];

        // roomNekos.forEach((roomNeko) => {
        //     const { id, name, metadata, skills } = roomNeko;
        //     let neko = new NekoEntity(id, name, metadata, skills);
        //     this.room.state.nekos.set(String(id), neko);
        // });

        // roomConsumptionItems.forEach((roomConsumptionItem, key) => {
        //     const { consumption_item_id, name, metadata, consumption_item_type_id } = roomConsumptionItem;
        //     this.room.state.consumptionItems.set(String(consumption_item_id), new ConsumptionItemEntity(consumption_item_id, name, consumption_item_type_id, metadata));
        // });

        // this.room.state.phase = EPhaseRoom.READY;
        this.room.broadcast("Ready", "ready");
    }
}
