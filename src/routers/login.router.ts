import express from 'express'
import passport from 'passport'

import { handleLogin } from '../controllers/login.controller'

const router = express.Router()

router.post(
  '/',
  passport.authenticate('google-id-token', { session: false }),
  handleLogin
)

export default router
