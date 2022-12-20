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

router.post('/', validate(userSchema), createUser)
router.get('/', findAllUsers)
router.get('/:userId', findUserById)
router.delete('/:userId', authCheck(['ADMIN']), deleteUser)
router.put(
  '/:userId',
  authCheck(['ADMIN', 'USER']),
  validate(updateUserSchema),
  updateUser
)

export default router
