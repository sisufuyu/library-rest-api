import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

import { AuthorDocument } from '../type'

const authorSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  biography: String,
})
authorSchema.plugin(uniqueValidator)

export default mongoose.model<AuthorDocument>('Author', authorSchema)
