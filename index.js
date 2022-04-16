import express from "express";
import winston from 'winston';
import accountRouter from "./router/accounts.js";
import { promises as fs } from 'fs';
import cors from 'cors';

const { readFile, writeFile } = fs;
global.fileName = 'accounts.json';
const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${timestamp}`;
});

global.logger = winston.createLogger({
  level: 'silly',
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: 'my-bank-api.log' }),
  ],
  format: combine(
    label({ label: 'my-bank-api' }),
    timestamp(),
    myFormat
  )
});


const app = express();
app.use(express.json());
// app.use(cors()); // Liberação cors global
app.use("/account", accountRouter);

app.listen(3002, async () => {

  try {
    await readFile(fileName);
    logger.info('API Started');
  } catch (error) {
    let initialJSON = {
      nextId: 1,
      accounts: []
    }
    writeFile(fileName, JSON.stringify(initialJSON)).then(() => {
      logger.info('API Sarted and File Created!');
    }).catch(err => {
      logger.erro(err);
    });
  }
})