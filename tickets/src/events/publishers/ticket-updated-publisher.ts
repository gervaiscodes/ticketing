import { Publisher, Subjects, TicketUpdatedEvent } from '@jd/ticketing-common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}
