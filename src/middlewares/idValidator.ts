import { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'

import { BadRequestError } from '../helpers/apiError'

const idValidator = (
  _req: Request,
  _res: Response,
  next: NextFunction,
  id: string
) => {
  if (!mongoose.isValidObjectId(id)) {
    next(new BadRequestError('Invalid id value'))
  }
  next()
}

export default idValidator
