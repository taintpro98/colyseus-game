import { BaseModel } from "./BaseModel";

export interface Player extends BaseModel {
    name: string;
    email: string;
}