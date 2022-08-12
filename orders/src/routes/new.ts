import express, { Request, Response } from 'express'
import { requireAuth, validateRequest } from '@jd/ticketing-common'
import { body } from 'express-validator'
import { Ticket } from '../models/ticket'
import { Order } from '../models/order'
import { NotFoundError, BadRequestError, OrderStatus } from '@jd/ticketing-common'

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

  // Build the order and save it the database

  // Publish an event

  res.send({})
})

export { router as newOrderRouter }
