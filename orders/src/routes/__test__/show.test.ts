import request from 'supertest'
import mongoose from 'mongoose'
import { app } from '../../app'
import { Order } from '../../models/order'
import { Ticket } from '../../models/ticket'

it('fetches the order', async () => {
  // create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Concert',
    price: 20
  })
  await ticket.save()

  const user = global.getAuthCookie()

  // make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({
      ticketId: ticket.id
    })
    .expect(201)

  // make a request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .expect(200)

  expect(fetchedOrder.id).toEqual(order.id)
})

it('returns an error if trying to fetch another users order', async () => {
  // create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Concert',
    price: 20
  })
  await ticket.save()

  const user = global.getAuthCookie()

  // make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({
      ticketId: ticket.id
    })
    .expect(201)

  // make a request to fetch the order
  const otherUser = global.getAuthCookie()
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', otherUser)
    .expect(401)
})
