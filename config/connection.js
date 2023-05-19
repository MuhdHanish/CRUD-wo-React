const { MongoClient } = require("mongodb");

const state = {
  db: null,
};

const url = "mongodb://127.0.0.1:27017";

const dbName = "Data";

const client = new MongoClient(url);

const connect = async () => {
  try {
    await client.connect();
    const db = client.db(dbName);
    state.db = db;
    console.log("Database connected successfully...")
  } catch (err) {
    console.log(err)
  }
};


const get = () => state.db;


module.exports = {
  connect,
  get,
};