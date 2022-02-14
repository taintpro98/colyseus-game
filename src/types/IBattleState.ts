export enum Cell{
    Empty,
    X,
    O
}
export interface IBattleState {
    board: number[],
    activePlayer: number,
    // players: any,
    // bosses: any,
    // turn: number
}

export default IBattleState;