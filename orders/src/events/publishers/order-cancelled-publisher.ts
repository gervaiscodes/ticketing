import { Publisher, OrderCancelledEvent, Subjects } from '@jd/ticketing-common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}
