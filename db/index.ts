import { Db, MongoClient } from "mongodb";

import CONFIG from "./config";

class Database {
  uri: string;
  databaseName: string;
  client: MongoClient;
  database: Db | null;
  constructor(uri: string, databaseName: string) {
    this.uri = uri;
    this.databaseName = databaseName;
    this.client = new MongoClient(uri);
    this.database = null;
  }

  async connect() {
    await this.client.connect();
    this.database = this.client.db(this.databaseName);
  }

  async find(collectionName: string, query = {}) {
    await this.connect();
    return this.database?.collection(collectionName).find(query);
  }

  async findOne(collectionName: string, query = {}) {
    await this.connect();
    return this.database?.collection(collectionName).findOne(query);
  }

  async insert(collectionName: string, document: Document) {
    await this.connect();
    return this.database?.collection(collectionName).insertOne(document);
  }

  async update(collectionName: string, query = {}, update = {}) {
    await this.connect();
    return this.database?.collection(collectionName).updateOne(query, update);
  }

  async delete(collectionName: string, query = {}) {
    await this.connect();
    return this.database?.collection(collectionName).deleteOne(query);
  }
  async deleteMany(collectionName: string, query = {}) {
    await this.connect();
    return this.database?.collection(collectionName).deleteMany(query);
  }

  async disconnect() {
    await this.client.close();
  }
}

// 使用示例
const db = new Database(CONFIG.URL, CONFIG.DB);
export default db;
