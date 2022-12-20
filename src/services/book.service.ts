import BookModel from '../models/Book'
import { NotFoundError } from '../helpers/apiError'
import { BookEntry, BookDocument, BookBasicProps } from '../type'
import { ObjectId } from 'mongodb'
import mongoose from 'mongoose'

const createBook = async (book: BookEntry): Promise<BookDocument> => {
  const newBook = new BookModel(book)
  return await newBook.save()
}

const findAllBooks = async (): Promise<BookDocument[]> => {
  return await BookModel.find({})
    .sort({ title: 1, publishedDate: -1 })
    .populate('authors')
}

const findBookById = async (bookId: string): Promise<BookDocument> => {
  const book = await BookModel.findById(bookId).populate('authors')

  if (!book) {
    throw new NotFoundError(`Book ${bookId} not Found`)
  }

  return book
}

const deleteBook = async (bookId: string): Promise<BookDocument> => {
  const book = await BookModel.findByIdAndDelete(bookId)

  if (!book) {
    throw new NotFoundError(`Book ${bookId} not Found`)
  }

  return book
}

//update book basic info
const updateBook = async (
  bookId: string,
  update: Partial<BookBasicProps>
): Promise<BookDocument> => {
  const book = await BookModel.findByIdAndUpdate(bookId, update, {
    new: true,
  }).populate('authors')

  if (!book) {
    throw new NotFoundError(`Book ${bookId} not found`)
  }

  return book
}

//find book that has author id
const findOneBookByAuthorId = async (
  authorId: string
): Promise<BookDocument | null> => {
  const id = new ObjectId(authorId)

  const book = await BookModel.findOne({ authors: id })
  return book
}

const findBooksByAuthorIds = async (
  authorIds: mongoose.Schema.Types.ObjectId[]
): Promise<BookDocument[] | null> => {
  const books = await BookModel.find({ authors: { $in: authorIds } }).populate(
    'authors'
  )
  return books
}

const findBookByISBN = async (isbn: string): Promise<BookDocument | null> => {
  const book = await BookModel.findOne({ ISBN13: isbn })

  return book
}

const findBooksByTitle = async (
  title: string
): Promise<BookDocument[] | null> => {
  const books = await BookModel.find({
    title: { $regex: title, $options: 'i' },
  }).populate('authors')

  return books
}

export default {
  createBook,
  findAllBooks,
  deleteBook,
  updateBook,
  findBookById,
  findOneBookByAuthorId,
  findBooksByAuthorIds,
  findBookByISBN,
  findBooksByTitle,
}
