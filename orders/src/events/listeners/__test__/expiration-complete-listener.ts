import { OrderStatus, ExpirationCompleteEvent } from '@jd/ticketing-common'
import { Message } from 'node-nats-streaming'
import mongoose from 'mongoose'
import { ExpirationCompleteListener } from '../expiration-complete-listener'
import { natsWrapper } from './../../../nats-wrapper'
import { Ticket } from '../../../models/ticket'
import { Order } from '../../../models/order'

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client)

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20
  })

  const order = Order.build({
    status: OrderStatus.Created,
    userId: '123',
    expiresAt: new Date(),
    ticket
  })

  await order.save()

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id
  }
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, order, data, msg }
}

it('updates the order status to cancelled', async () => {
  const { listener, order, data, msg } = await setup()

  await listener.onMessage(data, msg)

  const updatedOrder = await Order.findById(order.id)

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('emit an order cancelled event', async () => {
  const { listener, order, data, msg } = await setup()

  await listener.onMessage(data, msg)

  const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])

  expect(eventData.id).toEqual(order.id)
})

it('ack the message', async () => {
  const { listener, order, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})
