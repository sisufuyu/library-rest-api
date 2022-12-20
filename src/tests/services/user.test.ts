import userService from '../../services/user.service'
import bookService from '../../services/book.service'

import connect, { MongodbHelper } from '../../helpers/db-helper'
import { Role, UserDocument, UserEntry } from '../../type'

const bookData = {
  title: 'And Then There Were None',
  authors: [],
  description:
    'If you\'re one of the few who haven\'t experienced the genius of Agatha Christie, this novel is a stellar starting point.',
  ISBN13: '9780062073488',
  publisher: 'William Morrow & Company; Reissue edition',
  publishedDate: new Date('2011-03-01'),
  genres: ['Detective & Mystery', 'Classic'],
  image: 'uploads/books/1665700173443-16299._SY475_.jpg',
}
const userData: UserEntry = {
  firstName: 'yu',
  lastName: 'fu',
  email: 'sisu.fuyu@gmail.com',
  borrowedBooks: [],
  role: Role.ADMIN,
}

describe('User service', () => {
  let mongodbHelper: MongodbHelper
  let user: UserDocument

  beforeAll(async () => {
    mongodbHelper = await connect()
  })

  beforeEach(async () => {
    const book = await bookService.createBook(bookData)
    userData.borrowedBooks = [book._id]
    user = await userService.createUser(userData)
  })

  afterEach(async () => {
    await mongodbHelper.clearDatabase()
  })

  afterAll(async () => {
    await mongodbHelper.closeDatabase()
  })

  test('should create a user', () => {
    expect(user).toHaveProperty('_id')
    expect(user).toHaveProperty('email', userData.email)
  })

  test('should find all users', async () => {
    const users = await userService.findAllUsers()

    expect(users).toHaveLength(1)
  })

  test('should find a user by Id', async () => {
    const findUser = await userService.findUserById(user._id)

    expect(findUser).toHaveProperty('firstName', user.firstName)
    expect(findUser).toHaveProperty('email', user.email)
  })

  test('should find a user by email', async () => {
    const findUser = await userService.findUserByEmail(user.email)

    expect(findUser).toHaveProperty('firstName', user.firstName)
    expect(findUser).toHaveProperty('_id', user._id)
    expect(findUser).toHaveProperty('email', user.email)
  })

  test('should update a user', async () => {
    const update = { firstName: 'admin' }

    const updateUser = await userService.updateUser(user._id, update)
    expect(updateUser?.firstName).toEqual(update.firstName)
  })

  test('should delete a user', async () => {
    const deleteUser = await userService.deleteUser(user._id)

    expect(deleteUser).toHaveProperty('email', user.email)
  })
})
