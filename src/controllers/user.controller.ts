import { Request, Response, NextFunction } from 'express'

import userService from '../services/user.service'
import { UserDocument, UserEntry } from '../type'
import { BadRequestError } from '../helpers/apiError'

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.body as UserEntry
    const newUser = await userService.createUser(user)
    res.status(201).json(newUser)
  } catch (err) {
    if (
      err instanceof Error &&
      err.name === ('CastError' || 'ValidationError')
    ) {
      next(new BadRequestError('Invalid Request', 400, err))
    } else {
      next(err)
    }
  }
}

export const findAllUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await userService.findAllUsers()
    res.json(users)
  } catch (err) {
    if (
      err instanceof Error &&
      err.name === ('CastError' || 'ValidationError')
    ) {
      next(new BadRequestError('Invalid Request', 400, err))
    } else {
      next(err)
    }
  }
}

export const findUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId
    const user = await userService.findUserById(userId)
    res.json(user)
  } catch (err) {
    if (
      err instanceof Error &&
      err.name === ('CastError' || 'ValidationError')
    ) {
      next(new BadRequestError('Invalid Request', 400, err))
    } else {
      next(err)
    }
  }
}

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId
    await userService.deleteUser(userId)
    res.status(204).end()
  } catch (err) {
    if (
      err instanceof Error &&
      err.name === ('CastError' || 'ValidationError')
    ) {
      next(new BadRequestError('Invalid Request', 400, err))
    } else {
      next(err)
    }
  }
}

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.params.userId
  const user = req.user as UserDocument

  if (userId !== String(user?._id)) {
    next(new BadRequestError('Invalid Request', 400))
    return
  }

  try {
    const update = req.body as Partial<UserEntry>

    const user = await userService.updateUser(userId, update)
    res.json(user)
  } catch (err) {
    if (
      err instanceof Error &&
      err.name === ('CastError' || 'ValidationError')
    ) {
      next(new BadRequestError('Invalid Request', 400, err))
    } else {
      next(err)
    }
  }
}
