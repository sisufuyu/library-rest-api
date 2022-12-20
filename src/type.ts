import mongoose, { Document } from 'mongoose'

export interface BookBorrowProps {
  borrowerID: mongoose.Schema.Types.ObjectId
  borrowDate: Date
  returnDate: Date
}

// status: true, book is available; status: false, book is not available
export interface BookBasicProps {
  title: string
  authors: mongoose.Schema.Types.ObjectId[]
  description: string
  ISBN13: string
  publisher: string
  publishedDate: Date
  genres: string[]
  status?: boolean
  image: string
}

export type BookEntry = BookBasicProps & Partial<BookBorrowProps>

export type BookDocument = Document & BookEntry

export interface UserEntry {
  firstName: string
  lastName: string
  email: string
  borrowedBooks?: mongoose.Schema.Types.ObjectId[]
  role: Role
}

export type UserDocument = Document & UserEntry

export interface AuthorEntry {
  fullName: string
  biography?: string
}

export type AuthorDocument = Document & AuthorEntry

export interface ParsedToken {
  payload: {
    email: string
    email_verified: string
    name: string
    picture: string
    given_name: string
    family_name: string
    locale: string
  }
}

export interface VerifiedCallback {
  (error: any, user?: any, info?: any): void
}

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}
