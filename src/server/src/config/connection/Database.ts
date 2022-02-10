import PGPromise from "pg-promise"; 
import dotenv from "dotenv";  

dotenv.config(); 
console.log(process.env.DB_POSTGRESQL_USERNAME) 
const pgp = PGPromise()  
const connectionSetting: string = `postgresql://${process.env.DB_POSTGRESQL_USERNAME}:${process.env.DB_POSTGRESQL_PASSWORD}@${process.env.DB_POSTGRESQL_HOST}:${process.env.DB_POSTGRESQL_PORT}/${process.env.DB_POSTGRESQL_NAME}` 

export const db = pgp(connectionSetting); 