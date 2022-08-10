import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

declare global {
  function getAuthCookie(): string[]
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
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongo.stop()
}, 30000)

global.getAuthCookie = () => {
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  }
  const token = jwt.sign(payload, process.env.JWT_KEY!)
  const session = { jwt: token }
  const sessionJSON = JSON.stringify(session)
  const base64 = Buffer.from(sessionJSON).toString('base64')

  return [`session=${base64}`]
}
