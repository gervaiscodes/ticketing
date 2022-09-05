import mongoose, { mongo } from 'mongoose'
import { Message } from 'node-nats-streaming'
import { OrderCancelledEvent, OrderStatus } from '@jd/ticketing-common'
import { OrderCreatedListener } from '../order-created-listener'
import { OrderCancelledListener } from '../order-cancelled-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { Ticket } from '../../../models/ticket'

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client)

  // Create and save a ticket
  const orderId = new mongoose.Types.ObjectId().toHexString()
  const ticket = Ticket.build({
    title: 'concert',
    price: 99,
    userId: '123'
  })
  ticket.set({ orderId })
  await ticket.save()

  // Create a fake data event
  const data: OrderCancelledEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    ticket: {
      id: ticket.id
    }
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { msg, data, ticket, orderId, listener }
}

it('updates the ticket, publishes an event, and acks the message', async () => {
  const { msg, data, ticket, orderId, listener } = await setup()

  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket?.orderId).not.toBeDefined()
  expect(msg.ack).toHaveBeenCalled()
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
