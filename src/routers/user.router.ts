import express from 'express'

import idValidator from '../middlewares/idValidator'
import validate, {
  userSchema,
  updateUserSchema,
} from '../middlewares/requestValidator'
import {
  createUser,
  findAllUsers,
  findUserById,
  deleteUser,
  updateUser,
} from '../controllers/user.controller'
import authCheck from '../middlewares/authCheck'

const router = express.Router()

router.param('userId', idValidator)

router.post('/', authCheck(['ADMIN']), validate(userSchema), createUser)
router.get('/', authCheck(['ADMIN']), findAllUsers)
router.get('/:userId', authCheck(['ADMIN', 'USER']), findUserById)
router.delete('/:userId', authCheck(['ADMIN']), deleteUser)
router.put(
  '/:userId',
  authCheck(['ADMIN', 'USER']),
  validate(updateUserSchema),
  updateUser
)

export default router
