import { Publisher, OrderCreatedEvent, Subjects } from '@jd/ticketing-common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
}
