require('dotenv').config();

export const environment = process.env.NODE_ENV;
export const port = process.env.PORT;
export const DB = process.env.DB_URL;
export const logDirectory = process.env.Log_Dir;
