export interface Skill {
    skill_id: number,
    name: string,
    type: number,
    speed: number,
    metadata: string
}

export interface Action {
    character_name: string;
    character_type: number;
    skill_id: number;
    speed: number;
    metadata: string
}

export type SkillInformation = {
    [key: string]: Skill
}
export interface Neko {
    name: string,
    damage: number,
    blood: number,
    skills: Skill[]
}

export interface Boss {
    name: string,
    damage: number,
    blood: number
}
export interface IBattleState {
    board: number[],
    queue: Action[],
    activePlayer: number,
    bosses: Boss[],
    players: {
        [key: string]: {
            name: string,
            nekoes: Neko[]
        }
    }
}

export default IBattleState;