import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request from 'supertest'

import { app } from '../app'

declare global {
  function getAuthCookie(): Promise<string[]>
}

let mongo: any

beforeAll(async () => {
  process.env.JWT_KEY = 'asd'

  mongo = await MongoMemoryServer.create()
  const mongoUri = await mongo.getUri()

  await mongoose.connect(mongoUri)
})

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections()

  for(let collection of collections) {
    await collection.deleteMany({})
  }

  jest.setTimeout(30000)
})

afterAll(async () => {
  await mongo.stop()
  await mongoose.disconnect()
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
