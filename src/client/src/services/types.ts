/// enums
export enum EMessagePVERoom {
    Ready = "Ready",
    StartRound = "StartRound",
    CalculateQueue = "CalculateQueue",
    StartTurn = "StartTurn",
    Action = "Action",
    Result = "Result",
    DoneAnimation = "Done Animation",
    EndTurn = "EndTurn",
    EndRound = "EndRound",
    EndGame = "EndGame",
    Left = "Left",
}

export enum EActionEntityTypePvERoom {
    SKILL,
    ITEM,
    NONE
}

export enum EEntityTypePvERoom {
    NEKO,
    ENEMY,
}

/// types
export type TResponseQueue = {
    index: number;
    turns: { type: EEntityTypePvERoom; id: string }[];
};

export type TPlanningInfoPVERoom = {
    nekoId: string,
    actionType: EActionEntityTypePvERoom
    targets?: [{
        id: string, type: EEntityTypePvERoom
    }],
    actionId?: string;
}