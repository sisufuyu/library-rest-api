import GoogleTokenStrategy from 'passport-google-id-token'

import { GOOGLE_CLIENT_ID } from '../util/secrets'
import { ParsedToken, Role, VerifiedCallback } from '../type'
import userService from '../services/user.service'

const whiteList = ['sisu.fuyu@gmail.com']
// console.log('client_id', GOOGLE_CLIENT_ID)

export default function () {
  return new GoogleTokenStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
    },
    async (
      parsedToken: ParsedToken,
      _googleId: string,
      done: VerifiedCallback
    ) => {
      // console.log('parsed token', parsedToken)
      // console.log('google id', _googleId)
      try {
        const { email, given_name, family_name } = parsedToken.payload

        //check if user, if not create a new user
        let person = await userService.findUserByEmail(email)
        if (!person) {
          let role = Role.USER
          if (whiteList.includes(email)) role = Role.ADMIN
          person = await userService.createUser({
            email,
            firstName: given_name,
            lastName: family_name,
            role,
          })
        }

        done(null, person)
      } catch (err) {
        console.log(err)
        done(err)
      }
    }
  )
}
