import express from 'express'
import multer from 'multer'

import authCheck from '../middlewares/authCheck'
import idValidator from '../middlewares/idValidator'
import validate, {
  bookSchema,
  borrowBookSchema,
  createBookSChema,
} from '../middlewares/requestValidator'
import { bookRequestPreprocess } from '../middlewares/requestPreprocess'
import {
  createBook,
  findAll,
  findBookById,
  deleteBook,
  updateBookInfo,
  updateBookBorrow,
  updateBookReturn,
  updateBookImage,
  searchBook,
} from '../controllers/book.controller'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/books/')
  },
  filename: function (_req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  },
})
const upload = multer({ storage })

const router = express.Router()

router.param('bookId', idValidator)

router.post(
  '/',
  authCheck(['ADMIN']),
  upload.single('image'),
  validate(createBookSChema),
  bookRequestPreprocess,
  createBook
)
router.get('/', findAll)
router.get('/search', searchBook)
router.get('/:bookId', findBookById)
router.delete('/:bookId', authCheck(['ADMIN']), deleteBook)
router.put(
  '/:bookId/basicInfo',
  authCheck(['ADMIN']),
  validate(bookSchema),
  bookRequestPreprocess,
  updateBookInfo
)
router.put(
  '/:bookId/borrowInfo',
  authCheck(['USER', 'ADMIN']),
  validate(borrowBookSchema),
  updateBookBorrow
)
router.put(
  '/:bookId/returnInfo',
  authCheck(['USER', 'ADMIN']),
  updateBookReturn
)
router.put(
  '/:bookId/image',
  upload.single('image'),
  authCheck(['ADMIN']),
  updateBookImage
)

export default router
