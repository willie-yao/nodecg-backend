const express = require('express');
const { MongoClient } = require("mongodb");
const cors = require('cors');

const app = express();
var bodyParser = require('body-parser')

require('dotenv').config();
const uri = process.env.MONGODB_URI

const client = new MongoClient(uri);
async function run() {
  try {
    console.log("Connecting to the db...");
    const database = client.db('sample_mflix');
    const movies = database.collection('movies');
    // Query for a movie that has the title 'Back to the Future'
    const query = { title: 'Back to the Future' };
    const movie = await movies.findOne(query);
    console.log(movie);
  } catch {
    return null
  }
}

async function getPlayer(playerName) {
  try {
    console.log("Connecting to the db...");
    const database = client.db('smash');
    const players = database.collection('players');
    const query = { name: playerName };
    const player = await players.findOne(query);
    console.log(player);
    return player;
  } catch {
    return null
  }
}

async function postPlayer(player) {
  try {
    console.log("Connecting to the db...");
    const database = client.db('smash');
    const players = database.collection('players');
    console.log("player name: " + player.name)
    const filter = { name: player.name };
    return players.findOneAndUpdate(filter, {$set: player}, {upsert: true})
  } catch {
    return null
  }
}

app.use(bodyParser.json())
app.use(cors());
app.options('*', cors()) // include before other routes

app.put('/players', (req, res) => {
  var name = req.body.name;
  console.log("Body: " + req.body)
  console.log("Name: " + name)
  var response = getPlayer(name).catch(console.dir);
  response.then((value) => {
    console.log("Value: " + value)
    res.send(value)
  }).catch(console.dir);
});

app.post('/players', (req, res) => {
  console.log("Body: " + req.body)
  postPlayer(req.body).then(res.send("Success")).catch(console.dir);
});

app.get('/', (req, res) => {
  res.send('Successful response.');
  run().catch(console.dir);
});

app.listen(3000, () => console.log('Example app is listening on port 3000.'));
