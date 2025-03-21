import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { natsWrapper } from './../../nats-wrapper'
import { Ticket } from '../../models/ticket'

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  await request(app)
          .put(`/api/tickets/${id}`)
          .set('Cookie', global.getAuthCookie())
          .send({
            title: 'ddsq',
            price: 20
          })
          .expect(404)
})

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  await request(app)
          .put(`/api/tickets/${id}`)
          .send({
            title: 'ddsq',
            price: 20
          })
          .expect(401)
})

it('returns a 401 if the user does not own the ticket', async () => {
  const createdTicket = await request(app).post('/api/tickets').set('Cookie', global.getAuthCookie()).send({
    title: 'Concert',
    price: 20
  })

  await request(app)
          .put(`/api/tickets/${createdTicket.body.id}`)
          .set('Cookie', global.getAuthCookie()) // New cookie == new user
          .send({
            title: 'ddsq',
            price: 20
          })
          .expect(401)
})

it('returns a 400 if the user provides and invalid title or price', async () => {
  const cookie = global.getAuthCookie()

  const createdTicket = await request(app).post('/api/tickets').set('Cookie', cookie).send({
    title: 'Concert',
    price: 20
  })

  await request(app)
    .put(`/api/tickets/${createdTicket.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 20
    })
    .expect(400)

  await request(app)
    .put(`/api/tickets/${createdTicket.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'fdgdfg',
      price: -20
    })
    .expect(400)
})

it('updates the ticket if provided valid inputs', async () => {
  const cookie = global.getAuthCookie()

  const createdTicket = await request(app).post('/api/tickets').set('Cookie', cookie).send({
    title: 'Concert',
    price: 20
  })

  await request(app)
    .put(`/api/tickets/${createdTicket.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'sdfdsf',
      price: 42
    })
    .expect(200)

  const ticketUpdated = await request(app)
    .get(`/api/tickets/${createdTicket.body.id}`)
    .send()

  expect(ticketUpdated.body.title).toEqual('sdfdsf')
  expect(ticketUpdated.body.price).toEqual(42)
})

it('publishes an event', async () => {
  const cookie = global.getAuthCookie()
  const createdTicket = await request(app).post('/api/tickets').set('Cookie', cookie).send({
    title: 'Concert',
    price: 20
  })

  await request(app)
    .put(`/api/tickets/${createdTicket.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'sdfdsf',
      price: 42
    })
    .expect(200)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})

it('rejects updates if the ticket is reserved', async () => {
  const cookie = global.getAuthCookie()
  const createdTicket = await request(app).post('/api/tickets').set('Cookie', cookie).send({
    title: 'Concert',
    price: 20
  })

  const ticket = await Ticket.findById(createdTicket.body.id)
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() })
  await ticket!.save()

  await request(app)
    .put(`/api/tickets/${createdTicket.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'sdfdsf',
      price: 42
    })
    .expect(400)
})
