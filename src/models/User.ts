import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

import { Role, UserDocument } from '../type'

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  borrowedBooks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
    },
  ],
  role: {
    type: String,
    default: Role.USER,
    required: true,
  },
})
userSchema.plugin(uniqueValidator)

export default mongoose.model<UserDocument>('User', userSchema)
