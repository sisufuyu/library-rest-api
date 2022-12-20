import { Request, Response, NextFunction } from 'express'
import { NotFoundError } from '../helpers/apiError'

const unknownEndPoint = (_req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError('Unknown Endpoint'))
}

export default unknownEndPoint
