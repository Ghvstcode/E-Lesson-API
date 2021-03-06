import dotenv from 'dotenv';

dotenv.config();
export const environment = process.env.NODE_ENV;
export const port = process.env.PORT;
export const DBURI = process.env.DB_URL;
export const logDirectory = process.env.Log_Dir;
export const jwtSecret = process.env.JWT_TOKEN;
