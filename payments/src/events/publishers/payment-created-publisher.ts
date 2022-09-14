import { Publisher, PaymentCreatedEvent, Subjects } from '@jd/ticketing-common'

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated
}
