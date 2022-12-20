import { Request, Response, NextFunction } from 'express'

import bookService from '../services/book.service'
import { BadRequestError, ForbiddenError } from '../helpers/apiError'
import authorService from '../services/author.service'
import { BookBorrowProps, BookDocument, BookEntry, UserDocument } from '../type'

export const createBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log('file: ', req.file)
  // console.log('body: ', req.body)
  const image = `${req.file?.destination}${req.file?.filename}`

  try {
    const authorIds = await authorService.getAuthorsByName(req.body.authors)
    const book: BookEntry = { ...req.body, authors: authorIds, image }

    const newBook = await bookService.createBook(book)

    res.status(201).json(newBook)
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      next(new BadRequestError(err.message, 400, err))
    } else {
      next(err)
    }
  }
}

export const findAll = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const books = await bookService.findAllBooks()

    res.json(books)
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      next(new BadRequestError('Invalid Request', 400, err))
    } else {
      next(err)
    }
  }
}

export const findBookById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookId = req.params.bookId
    const book = await bookService.findBookById(bookId)

    res.json(book)
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      next(new BadRequestError('Invalid Request', 400, err))
    } else {
      next(err)
    }
  }
}

export const updateBookInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bookId = req.params.bookId
  //update book send all book properties
  const update = req.body

  try {
    const authorIds = await authorService.getAuthorsByName(update.authors)
    update.authors = authorIds

    const book = await bookService.updateBook(bookId, update)

    res.json(book)
    return
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      next(new BadRequestError('Invalid Request', 400, err))
    } else {
      next(err)
    }
  }
}

//controller for update book borrow information
export const updateBookBorrow = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookId = req.params.bookId
    const update = req.body as BookBorrowProps
    const user = req.user as UserDocument

    const book = await bookService.findBookById(bookId)
    const bookAvailable = book && book.status

    if (bookAvailable) {
      book.borrowerID = user._id
      book.borrowDate = update.borrowDate
      book.returnDate = update.returnDate
      book.status = false

      await book.save()
    } else {
      return next(
        new BadRequestError(`Book ${bookId} not found or not available`)
      )
    }

    //update user borrowed books also
    const borrowedBooks = user.borrowedBooks
    const userHaveBooks = borrowedBooks && borrowedBooks.length > 0
    if (userHaveBooks) {
      borrowedBooks.push(book?._id)
    } else user.borrowedBooks = [book?._id]
    await user.save()

    res.json(book)
    return
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      next(new BadRequestError('Invalid Request', 400, err))
    } else {
      next(err)
    }
  }
}

export const updateBookReturn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookId = req.params.bookId
    const user = req.user as UserDocument

    const book = await bookService.findBookById(bookId)

    // if book borrower ID equals to authorization user ID, allow to return book
    const canReturn = String(book.borrowerID) === String(user._id)
    if (!canReturn) {
      return next(new BadRequestError('Invalid Request'))
    }

    //update book borrow status
    book.borrowDate = undefined
    book.returnDate = undefined
    book.borrowerID = undefined
    book.status = true
    await book.save()

    // update user borrowed books
    user.borrowedBooks = user.borrowedBooks?.filter(
      (id) => String(id) !== String(book._id)
    )
    await user.save()

    res.json(book)
    return
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      next(new BadRequestError('Invalid Request', 400, err))
    } else {
      next(err)
    }
  }
}

export const updateBookImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bookId = req.params.bookId

  const image = `${req.file?.destination}${req.file?.filename}`
  try {
    const book = await bookService.findBookById(bookId)

    book.image = image
    await book.save()

    res.json(book)
    return
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      next(new BadRequestError('Invalid Request', 400, err))
    } else {
      next(err)
    }
  }
}

export const deleteBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookId = req.params.bookId
    let book = await bookService.findBookById(bookId)

    // if status is false, not allowed to delete book
    if (!book?.status)
      return next(new ForbiddenError('Forbidden to delete book'))

    book = await bookService.deleteBook(bookId)

    res.json(book)
    return
  } catch (err) {
    if (
      err instanceof Error &&
      (err.name === 'CastError' || err.name === 'ValidationError')
    ) {
      next(new BadRequestError('Invalid Request', 400, err))
    } else {
      next(err)
    }
  }
}

export const searchBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const field = req.query.field
  const keyword = req.query.keyword as string

  if (!field || !keyword) {
    return next(new BadRequestError('Invalid Request'))
  }

  try {
    let result: BookDocument[] = []

    if (field === 'isbn' || field === 'all') {
      const book = await bookService.findBookByISBN(keyword)
      if (book) {
        result = [book]
      }
    }

    if (field === 'title' || field === 'all') {
      const booksWithTitle = await bookService.findBooksByTitle(keyword)
      const booksExist = booksWithTitle && booksWithTitle.length > 0

      if (booksExist) {
        if (field === 'all') result = [...result, ...booksWithTitle]
        else result = booksWithTitle
      }
    }

    if (field === 'author' || field === 'all') {
      const authorIds = await authorService.findAuthorIdsByName(keyword)

      if (authorIds.length > 0) {
        const booksWIthAuthor = await bookService.findBooksByAuthorIds(
          authorIds
        )
        const booksExist = booksWIthAuthor && booksWIthAuthor.length > 0

        if (booksExist) {
          if (field === 'all') result = [...result, ...booksWIthAuthor]
          else result = booksWIthAuthor
        }
      }
    }

    res.json(result)
    return
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      next(new BadRequestError('Invalid Request', 400, err))
    } else {
      next(err)
    }
  }
}
