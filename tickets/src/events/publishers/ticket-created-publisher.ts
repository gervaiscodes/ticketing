import { Publisher, Subjects, TicketCreatedEvent } from '@jd/ticketing-common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated
}
