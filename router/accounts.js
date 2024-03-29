import express from 'express';
import { promises as fs } from 'fs';
import cors from 'cors';

const { readFile, writeFile } = fs;

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    let account = req.body;
    if (!account.name || account.balance == null) {
      res.seng('name or balance is null');
    }

    const data = JSON.parse(await readFile(fileName));
    console.log(data);
    account = {
      id: data.nextId++,
      name: account.name,
      balance: account.balance
    };
    data.accounts.push(account);

    await writeFile(fileName, JSON.stringify(data, null, 2));
    res.send(account);
    logger.info(` POST /account - ${JSON.stringify(account)}`);
  } catch (err) {
    next(err)
    res.end();
  }
});

router.get('/', cors(), async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile(fileName));
    delete data.nextId;
    res.send(data);
    logger.info('GET /account');
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile(fileName));
    let id = req.params.id;
    const account = data.accounts.find(e => parseInt(e.id) == parseInt(id));
    res.send(account);
    logger.info('GET /account/:id');

  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile(fileName));
    data.accounts = data.accounts.filter(e => parseInt(e.id) !== parseInt(req.params.id));
    await writeFile(fileName, JSON.stringify(data, null, 2));
    res.end();
    logger.info(`DELETE /accont/:id${req.id}`);
  } catch (err) {
    next(err);
  }
});

router.put('/', async (req, res, next) => {
  try {
    const account = req.body;
    if (!account.name || account.balance == null) {
      res.seng('name or balance is null');
    }
    const data = JSON.parse(await readFile(fileName));
    const index = data.accounts.findIndex(a => a.id === account.id);
    if (index === -1) {
      res.send("index not found");
    }


    data.accounts[index].name = account.name;
    data.accounts[index].balance = account.balance;

    await writeFile(fileName, JSON.stringify(data));
    res.send(account);
    logger.info(` PUT /account - ${JSON.stringify(account)}`)

  } catch (err) {
    next(err);
  }
});

router.patch('/updateBalance', async (req, res, next) => {
  try {
    const account = req.body;
    const data = JSON.parse(await readFile(fileName));
    const index = data.accounts.findIndex(a => a.id === account.id);

    data.accounts[index].balance = account.balance;
    await writeFile(fileName, JSON.stringify(data));
    res.send(data.accounts[index]);
    logger.info(` PATCH /updateBalance - ${JSON.stringify(account)}`)

  } catch (err) {
    next(err);
  }

});

router.use((err, req, res, next) => {
  logger.error(`${req.method} ${req.baseUrl} - ${err.message}`);
  res.send(400).send({ error: err.message });
});

export default router;