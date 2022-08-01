import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request from 'supertest'
import { MongoClient } from 'mongodb'

import { app } from '../app'

declare global {
  function getAuthCookie(): Promise<string[]>
}

let mongoClient: MongoClient
let mongoServer: MongoMemoryServer

beforeAll(async () => {
  process.env.JWT_KEY = 'asd'

  mongoServer = await MongoMemoryServer.create()
  const mongoUri = await mongoServer.getUri()

  mongoClient = await MongoClient.connect(mongoUri, {})
})

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections()

  for(let collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  if (mongoClient) {
    await mongoClient.close()
  }

  if (mongoServer) {
    await mongoServer.stop()
  }
})

global.getAuthCookie = async () => {
  const email = 'test@test.com'
  const password = 'password'

  const response = await request(app)
    .post('/api/users/signup')
    .send({ email, password })
    .expect(201)

  return response.get('Set-Cookie')
}
