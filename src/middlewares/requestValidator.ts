import { z, AnyZodObject, ZodError } from 'zod'
import { Request, Response, NextFunction } from 'express'

import { BadRequestError } from '../helpers/apiError'

export const userSchema = z.object({
  body: z.object({
    firstName: z.string({ required_error: 'First name is required' }),
    lastName: z.string({ required_error: 'Last name is required' }),
    email: z
      .string({ required_error: 'Email is required' })
      .email('Not a valid email'),
    role: z
      .string({ required_error: 'Role is required' })
      .regex(/^USER|ADMIN$/),
  }),
})

export const updateUserSchema = z.object({
  body: z.object({
    firstName: z.string({}).optional(),
    lastName: z.string({}).optional(),
    email: z.string({}).email('Not a valid email').optional(),
    role: z
      .string({})
      .regex(/^USER|ADMIN$/)
      .optional(),
  }),
})

const parseDate = (arg: unknown) => {
  if (typeof arg == 'string' || arg instanceof Date) return new Date(arg)
}

export const bookSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Book title is required' }),
    description: z.string({ required_error: 'Book description is required' }),
    ISBN13: z.string({ required_error: 'Book ISBN13 is required' }),
    publisher: z.string({ required_error: 'Book publisher is required' }),
    publishedDate: z.preprocess(
      parseDate,
      z.date({
        required_error: 'Book published date is required',
        invalid_type_error: 'Book published date is not valid',
      })
    ),
    authors: z.string({ required_error: 'Book author is required' }).array(),
    genres: z.string({ required_error: 'Book genre is required' }).array(),
  }),
})

export const createBookSChema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Book title is required' }),
    description: z.string({ required_error: 'Book description is required' }),
    ISBN13: z.string({ required_error: 'Book ISBN13 is required' }),
    publisher: z.string({ required_error: 'Book publisher is required' }),
    publishedDate: z.preprocess(
      parseDate,
      z.date({
        required_error: 'Book published date is required',
        invalid_type_error: 'Book published date is not valid',
      })
    ),
    genres: z.string({ required_error: 'Book author is required' }),
    authors: z.string({ required_error: 'Book genre is required' }),
  }),
})

export const borrowBookSchema = z.object({
  body: z.object({
    borrowDate: z.preprocess(
      parseDate,
      z.date({
        required_error: 'Book borrow date is required',
        invalid_type_error: 'Borrow date is not valid',
      })
    ),
    returnDate: z.preprocess(
      parseDate,
      z.date({
        required_error: 'Book return date is required',
        invalid_type_error: 'Return date is not valid',
      })
    ),
  }),
})

export const authorSchema = z.object({
  body: z.object({
    fullName: z.string({ required_error: 'Author name is required' }),
    biography: z.string().optional(),
  }),
})

const validate =
  (schema: AnyZodObject) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })
      return next()
    } catch (err) {
      if (err instanceof ZodError) {
        return next(new BadRequestError(err.issues[0].message, 400, err))
      }
      next(err)
    }
  }

export default validate
