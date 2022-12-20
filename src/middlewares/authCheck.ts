import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import { UserDocument } from '../type'
import { UnauthorizedError } from '../helpers/apiError'
import userService from '../services/user.service'

type Decode = {
  user: UserDocument
}

const authCheck =
  (roles: string[]) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const auth = req.headers.authorization
      const token = auth?.split(' ')[1]

      const decoded = jwt.verify(
        token as string,
        process.env.JWT_SECRET as string
      ) as Decode
      const user = await userService.findUserById(decoded.user._id)

      if (user && roles.includes(user.role)) {
        req.user = user
        next()
        return
      } else next(new UnauthorizedError('Authorization fail'))
    } catch (err) {
      next(new UnauthorizedError('Authorization fail'))
    }
  }

export default authCheck
