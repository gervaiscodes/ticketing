import { Message } from 'node-nats-streaming'
import { Listener, OrderCancelledEvent, Subjects } from '@jd/ticketing-common'
import { queueGroupName } from './queue-group-name'
import { Ticket } from '../../models/ticket'
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher'

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled
  queueGroupName = queueGroupName

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id)

    // If no ticket throw error
    if (!ticket) {
      throw new Error('Ticket not found')
    }

    // Mark the ticket as not being reserved by setting the orderId property to undefined
    ticket.set({ orderId: undefined })

    // Save the ticket
    await ticket.save()

    // Publish event
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version
    })

    // ack the message
    msg.ack()
  }
}
