import { Message } from 'node-nats-streaming'
import { Subjects, Listener, PaymentCreatedEvent, OrderStatus } from '@jd/ticketing-common'
import { Ticket } from '../../models/ticket'
import { queueGroupName } from './queue-group-name'
import { Order } from '../../models/order'

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated
  queueGroupName = queueGroupName

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId)

    if (!order) {
      throw new Error('Order not found')
    }

    order.set({ status: OrderStatus.Complete })

    await order.save()

    // Not necessary to emit an order updated event here because this order should
    // not be updated in the future now it has been paid

    msg.ack()
  }
}
