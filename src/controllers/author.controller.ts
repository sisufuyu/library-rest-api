import { Request, Response, NextFunction } from 'express'

import authorService from '../services/author.service'
import { BadRequestError, ForbiddenError } from '../helpers/apiError'
import bookService from '../services/book.service'

export const createAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const author = req.body
    const newAuthor = await authorService.createAuthor(author)

    res.status(201).json(newAuthor)
    return
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      next(new BadRequestError(err.message, 400, err))
    } else {
      next(err)
    }
  }
}

export const findAllAuthors = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authors = await authorService.findAllAuthors()
    res.json(authors)
    return
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      next(new BadRequestError(err.message, 400, err))
    } else {
      next(err)
    }
  }
}

export const findAuthorById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorId = req.params.authorId
    const author = await authorService.findAuthorById(authorId)
    res.json(author)
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      next(new BadRequestError(err.message, 400, err))
    } else {
      next(err)
    }
  }
}

export const deleteAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorId = req.params.authorId
    const book = await bookService.findOneBookByAuthorId(authorId)

    //if there is a book with this author, doesn't allow to delete the author
    if (book) {
      next(new ForbiddenError('Forbidden to delete author'))
    }

    const author = await authorService.deleteAuthor(authorId)
    res.json(author)
    return
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      next(new BadRequestError(err.message, 400, err))
    } else {
      next(err)
    }
  }
}

export const updateAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorId = req.params.authorId
    const { fullName, biography } = req.body
    const author = await authorService.updateAuthor(authorId, {
      fullName,
      biography,
    })
    res.json(author)
    return
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      next(new BadRequestError(err.message, 400, err))
    } else {
      next(err)
    }
  }
}
