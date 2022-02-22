export enum EMessagePVERoom {
    Ready = "Ready",
    StartRound = "StartRound",
    CalculateQueue = "CalculateQueue",
    StartTurn = "StartTurn",
    Battle = "Battle",
    EndTurn = "EndTurn",
    EndRound = "EndRound",
    EndGame = "EndGame",
    Left = "Left",
}

export enum EEntityTypePvERoom {
    NEKO,
    ENEMY,
}

export type TResponseQueue = {
    index: number;
    turns: { type: EEntityTypePvERoom; id: string }[];
};