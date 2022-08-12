import request from 'supertest'
import { app } from '../../app'
import { Order, OrderStatus } from '../../models/order'
import { Ticket } from '../../models/ticket'

it('marks an order as cancelled', async () => {
  // create a ticket
  const ticket = Ticket.build({
    title: 'Concert',
    price: 20
  })
  await ticket.save()

  const user = global.getAuthCookie()

  // make a request to create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({
      ticketId: ticket.id
    })
    .expect(201)

  // make a request to cancel the order
  const response = await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .expect(204)

  // excpect to be cancelled
  const updatedOrder = await Order.findById(order.id)
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it.todo('emits an event')
