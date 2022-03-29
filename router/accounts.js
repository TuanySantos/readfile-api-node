import express from 'express';
import { promises as fs } from 'fs';

const { readFile, writeFile } = fs;

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    let account = req.body;
    const data = JSON.parse(await readFile(fileName));
    console.log(data);
    account = { id: data.nextId++, ...account };
    data.accounts.push(account);

    await writeFile(fileName, JSON.stringify(data, null, 2));
    res.send(account);
    res.end();
  } catch (err) {
    res.status(400).send({ error: err.message });
    res.end();
  }
});

router.get('/', async (req, res) => {
  try {
    const data = JSON.parse(await readFile(fileName));
    delete data.nextId;
    res.send(data);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const data = JSON.parse(await readFile(fileName));
    let id = req.params.id;
    const account = data.accounts.find(e => parseInt(e.id) == parseInt(id));
    res.send(account);

  } catch (err) {
    res.send(400).send({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const data = JSON.parse(await readFile(fileName));
    data.accounts = data.accounts.filter(e => parseInt(e.id) !== parseInt(req.params.id));
    await writeFile(fileName, JSON.stringify(data, null, 2));
    res.end();
  } catch (err) {
    res.send(400).send({ error: err.message });
  }
});

router.put('/', async (req, res) => {
  try {
    const account = req.body;
    const data = JSON.parse(await readFile(fileName));
    const index = data.accounts.findIndex(a => a.id === account.id);

    data.accounts[index] = account;
    await writeFile(fileName, JSON.stringify(data));
    res.send(account);

  } catch (err) {
    res.send(400).send({ error: err.message });
  }
});

router.patch('/updateBalance', async (req, res) => {
  try {
    const account = req.body;
    const data = JSON.parse(await readFile(fileName));
    const index = data.accounts.findIndex(a => a.id === account.id);

    data.accounts[index].balance = account.balance;
    await writeFile(fileName, JSON.stringify(data));
    res.send(data.accounts[index]);

  } catch (err) {
    res.send(400).send({ error: err.message });
  }

});


export default router;