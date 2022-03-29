import express from "express";
import accountRouter from "./router/accounts.js";
import { promises as fs } from 'fs';

const { readFile, writeFile } = fs;
global.fileName = 'accounts.json';

const app = express();
app.use(express.json());

app.use("/account", accountRouter);

app.listen(3000, async () => {

  try {
    await readFile(fileName);

  } catch (error) {
    let initialJSON = {
      nextId: 1,
      accounts: []
    }
    writeFile(fileName, JSON.stringify(initialJSON)).then(() => {
      console.log('API Sarted and File Created!');
    }).catch(err => {
      console.log(err);
    });
  }
  console.log('API Started');
})