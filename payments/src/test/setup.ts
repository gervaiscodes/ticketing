import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

declare global {
  function getAuthCookie(id?: string): string[]
}

let mongo: any

jest.mock('../nats-wrapper')

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

  jest.clearAllMocks()
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongo.stop()
}, 30000)

global.getAuthCookie = (id?: string) => {
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  }
  const token = jwt.sign(payload, process.env.JWT_KEY!)
  const session = { jwt: token }
  const sessionJSON = JSON.stringify(session)
  const base64 = Buffer.from(sessionJSON).toString('base64')

  return [`session=${base64}`]
}
