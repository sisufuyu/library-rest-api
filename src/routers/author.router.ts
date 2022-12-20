import express from 'express'

import authCheck from '../middlewares/authCheck'
import idValidator from '../middlewares/idValidator'
import {
  createAuthor,
  deleteAuthor,
  findAllAuthors,
  findAuthorById,
  updateAuthor,
} from '../controllers/author.controller'
import validate, { authorSchema } from '../middlewares/requestValidator'

const router = express.Router()

router.param('authorId', idValidator)

router.post('/', authCheck(['ADMIN']), validate(authorSchema), createAuthor)
router.get('/', findAllAuthors)
router.get('/:authorId', findAuthorById)
router.delete('/:authorId', authCheck(['ADMIN']), deleteAuthor)
router.put(
  '/:authorId',
  authCheck(['ADMIN']),
  validate(authorSchema),
  updateAuthor
)

export default router
