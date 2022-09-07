import { Subjects, Publisher, ExpirationComplete } from '@jd/ticketing-common'

export class ExpirationCompletePublisher extends Publisher<ExpirationComplete> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
}
