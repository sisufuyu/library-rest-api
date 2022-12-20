import mongoose from 'mongoose'

import { AuthorEntry, AuthorDocument } from '../type'
import authorModel from '../models/Author'
import { NotFoundError } from '../helpers/apiError'

const createAuthor = async (author: AuthorEntry): Promise<AuthorDocument> => {
  const newAuthor = new authorModel(author)
  return await newAuthor.save()
}

const findAllAuthors = async (): Promise<AuthorDocument[]> => {
  return await authorModel.find({}).sort({ fullName: 1 })
}

const findAuthorById = async (
  authorId: string
): Promise<AuthorDocument | null> => {
  const author = await authorModel.findById(authorId)

  if (!author) {
    throw new NotFoundError(`Author ${authorId} not Found`)
  }

  return author
}

const findAuthorByName = async (
  name: string
): Promise<AuthorDocument | null> => {
  const author = await authorModel.findOne({ fullName: name })

  if (!author) {
    return null
  }

  return author
}

//get authors'id by names, if author doesn't exist, create a new author
const getAuthorsByName = async (
  names: string[]
): Promise<mongoose.Schema.Types.ObjectId[]> => {
  const authors = []

  for (let i = 0; i < names.length; i++) {
    const name = names[i]
    let author = await authorModel.findOne({ fullName: name }).exec()

    if (!author) {
      author = await authorModel.create({ fullName: name })
    }

    authors.push(author._id)
  }

  return authors
}

const deleteAuthor = async (
  authorId: string
): Promise<AuthorDocument | null> => {
  const author = await authorModel.findByIdAndDelete(authorId)

  if (!author) {
    throw new NotFoundError(`Author ${authorId} not Found`)
  }

  return author
}

const updateAuthor = async (
  authorId: string,
  update: AuthorEntry
): Promise<AuthorDocument | null> => {
  const author = await authorModel.findByIdAndUpdate(authorId, update, {
    new: true,
  })

  if (!author) {
    throw new NotFoundError(`Author ${authorId} not Found`)
  }

  return author
}

// get ids of authors whose name includes given text
const findAuthorIdsByName = async (
  name: string
): Promise<mongoose.Schema.Types.ObjectId[]> => {
  const authors = await authorModel.find({
    fullName: { $regex: name, $options: 'i' },
  })

  if (authors.length === 0) return []
  return authors.map((author) => author._id)
}

export default {
  createAuthor,
  findAllAuthors,
  findAuthorById,
  findAuthorByName,
  getAuthorsByName,
  deleteAuthor,
  updateAuthor,
  findAuthorIdsByName,
}
