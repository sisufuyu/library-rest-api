import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { UserDocument } from '../type'

import { UnauthorizedError } from '../helpers/apiError'

export const handleLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as UserDocument
    const token = jwt.sign({ user }, process.env.JWT_SECRET as string, {
      expiresIn: '2h',
    })
    res.json({ token })
    return
  } catch {
    next(new UnauthorizedError('Unauthorized Request'))
  }
}
