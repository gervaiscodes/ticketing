import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'

import { BadRequestError, validateRequest } from '@jd/ticketing-common'

import { User } from '../models/user'

const router = express.Router()

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body
    const existingUser = await User.findOne({ email: email })

    if (existingUser) {
      throw new BadRequestError('Email in use')
    }

    const user = User.build({ email, password })
    await user.save()

    const userJwt = jwt.sign({
      id: user.id,
      email: user.email
    }, process.env.JWT_KEY!)

    req.session = {
      jwt: userJwt
    }

    res.status(201).send(user)
  }
)

export { router as signupRouter }
