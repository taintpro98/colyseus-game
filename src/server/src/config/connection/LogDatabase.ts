import PGPromise from "pg-promise"; 
import dotenv from "dotenv";  

dotenv.config(); 
const pgp = PGPromise()  
const connectionLogSetting: string = `postgresql://${process.env.DB_POSTGRESQL_USERNAME}:${process.env.DB_POSTGRESQL_PASSWORD}@${process.env.DB_POSTGRESQL_HOST}:${process.env.DB_POSTGRESQL_PORT}/${process.env.DB_POSTGRESQL_LOG_NAME}`

export const dbLog = pgp(connectionLogSetting);