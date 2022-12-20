import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

import { BookDocument } from '../type'

// status: true, book is available; status: false, book is borrowed out
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true,
  },
  authors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Author',
      required: true,
    },
  ],
  description: {
    type: String,
    required: true,
  },
  ISBN13: {
    type: String,
    required: true,
    unique: true,
  },
  publisher: {
    type: String,
    required: true,
  },
  publishedDate: {
    type: Date,
    required: true,
  },
  genres: [
    {
      type: String,
      required: true,
    },
  ],
  borrowerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  borrowDate: Date,
  returnDate: Date,
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
  image: {
    type: String,
    required: true,
  },
})
bookSchema.plugin(uniqueValidator)

export default mongoose.model<BookDocument>('Book', bookSchema)
