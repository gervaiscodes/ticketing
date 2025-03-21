import express, { Request, Response } from 'express'
import { requireAuth, validateRequest } from '@jd/ticketing-common'
import { body } from 'express-validator'
import { Ticket } from '../models/ticket'
import { Order } from '../models/order'
import { NotFoundError, BadRequestError, OrderStatus } from '@jd/ticketing-common'
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher'
import { natsWrapper } from '../nats-wrapper'

const EXPIRATION_WINDOW_SECONDS = 15 * 60

const router = express.Router()

router.post('/api/orders', requireAuth, [
  body('ticketId').not().isEmpty().withMessage('ticketId must be provided')
], validateRequest, async (req: Request, res: Response) => {
  const { ticketId } = req.body

  // Find the ticket we try to order
  const ticket = await Ticket.findById(ticketId)
  if (!ticket) {
    throw new NotFoundError()
  }

  // Make sure this ticket is not already reserved
  const isReserved = await ticket.isReserved()
  if (isReserved) {
    throw new BadRequestError('Ticket is already reserved')
  }

  // Calculate an expiration date for this order
  const expiration = new Date()
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

  // Build the order and save it the database
  const order = Order.build({
    userId: req.currentUser!.id,
    status: OrderStatus.Created,
    expiresAt: expiration,
    ticket
  })
  await order.save()

  // Publish an event
  new OrderCreatedPublisher(natsWrapper.client).publish({
    id: order.id,
    version: order.version,
    status: order.status,
    userId: order.userId,
    expiresAt: order.expiresAt.toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price
    }
  })

  res.status(201).send(order)
})

export { router as newOrderRouter }
