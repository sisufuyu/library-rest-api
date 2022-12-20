import { Request, Response, NextFunction } from 'express'

import { genreList, isISBN13 } from '../helpers/helper'
import { BadRequestError } from '../helpers/apiError'

export const bookRequestPreprocess = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  let { authors, genres } = req.body

  if (typeof genres === 'string') {
    genres = JSON.parse(genres)
    req.body.genres = genres
  }

  genres.forEach((genre: string) => {
    if (!genreList.includes(genre)) {
      return next(new BadRequestError('Invalid genre'))
    }
  })

  if (!isISBN13(req.body.ISBN13)) {
    return next(new BadRequestError('Invalid ISBN13'))
  }

  if (typeof authors === 'string') {
    authors = JSON.parse(authors)
    req.body.authors = authors
  }

  return next()
}
