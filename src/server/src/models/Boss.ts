import { BaseModel } from "./BaseModel";

export interface Boss extends BaseModel {
    name: string;
    damage: number;
    blood: number;
    speed: number;
}