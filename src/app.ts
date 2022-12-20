import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
// import session from 'express-session'
// import cookieParser from 'cookie-parser'
import passport from 'passport'
import loginWithGoogle from './passport/google'

import unknownEndPoint from './middlewares/unknownEndPoint'
import apiErrorHandler from './middlewares/apiErrorHandler'
import apiContentType from './middlewares/apiContentType'
import bookRouter from './routers/book.router'
import userRouter from './routers/user.router'
import authorRouter from './routers/author.router'
import loginRouter from './routers/login.router'

dotenv.config({ path: '.env' })
const app = express()
app.use('/uploads', express.static('uploads'))

// Express configuration
app.set('port', process.env.PORT)

// Global middleware
app.use(
  cors({
    origin: '*',
  })
)
app.use(apiContentType)
app.use(express.json())
/** using passport also requires to ass session and cookieParser middlewares to express
 * To be activated later
app.use(cookieParser())
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      maxAge: 60 * 60 * 24,
    },
    secret: 'secret',
  })
)
app.use(passport.session())
*/
app.use(passport.initialize())
passport.use(loginWithGoogle())

app.use('/api/v1/login', loginRouter)

// Set up routers
app.use('/api/v1/books', bookRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/authors', authorRouter)

app.use(unknownEndPoint)

// Custom API error handler
app.use(apiErrorHandler)

export default app
