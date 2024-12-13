import { MongoClient } from "mongodb";
import CONFIG from "./config.js";
class Database {
  constructor(uri, databaseName) {
    this.uri = uri;
    this.databaseName = databaseName;
    this.client = new MongoClient(uri);
  }

  async connect() {
    await this.client.connect();
    this.database = this.client.db(this.databaseName);
  }

  async find(collectionName, query = {}) {
    await this.connect();
    return this.database.collection(collectionName).find(query);
  }

  async findOne(collectionName, query = {}) {
    await this.connect();
    return this.database.collection(collectionName).findOne(query);
  }

  async insert(collectionName, document) {
    await this.connect();
    return this.database.collection(collectionName).insertOne(document);
  }

  async update(collectionName, query, update) {
    await this.connect();
    return this.database.collection(collectionName).updateOne(query, update);
  }

  async delete(collectionName, query) {
    await this.connect();
    return this.database.collection(collectionName).deleteOne(query);
  }
  async deleteMany(collectionName, query = {}) {
    await this.connect();
    return this.database.collection(collectionName).deleteMany(query);
  }

  async disconnect() {
    await this.client.close();
  }
}

// 使用示例
const db = new Database(CONFIG.URL, CONFIG.DB);
export default db;
