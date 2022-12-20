import request from 'supertest'
import jwt from 'jsonwebtoken'

import app from '../../app'
import connect, { MongodbHelper } from '../../helpers/db-helper'
import userService from '../../services/user.service'
import { UserEntry, Role, UserDocument } from '../../type'

const adminData: UserEntry = {
  firstName: 'Anna',
  lastName: 'Wang',
  email: 'anna.wang@gmail.com',
  role: Role.ADMIN,
}

const createUser = async () => {
  return await userService.createUser(adminData)
}

const data = {
  title: 'Tess of the D\'Urbervilles',
  authors: ['Thomas Hardy'],
  ISBN13: '9781095725825',
  publisher: 'Penguin Classics',
  publishedDate: new Date('2003-01-30'),
  description:
    'Tess of the D\'Urbervilles: A Pure Woman Faithfully Presented is a novel by Thomas Hardy.',
  genres: ['Romance', 'Literary Fiction', 'Classic'],
  image: 'uploads/test/tess.jpg',
}

const createBook = async (token: string) => {
  return await request(app)
    .post('/api/v1/books')
    .set('Authorization', `Bearer ${token}`)
    .field('title', data.title)
    .field('description', data.description)
    .field('authors', JSON.stringify(data.authors))
    .field('ISBN13', data.ISBN13)
    .field('genres', JSON.stringify(data.genres))
    .field('publisher', data.publisher)
    .field('publishedDate', data.publishedDate.toDateString())
    .attach('image', data.image)
}

const borrowBook = async (userId: string, bookId: string, token: string) => {
  const borrowDate = new Date()
  const returnDate = new Date(borrowDate.getTime() + 30 * 24 * 60 * 60 * 1000)

  const borrowInfo = {
    borrowerID: userId,
    borrowDate,
    returnDate,
  }

  return await request(app)
    .put(`/api/v1/books/${bookId}/borrowInfo`)
    .set('Authorization', `Bearer ${token}`)
    .send(borrowInfo)
}

describe('Book router', () => {
  let mongodbHelper: MongodbHelper
  let user: UserDocument
  let token: string

  beforeAll(async () => {
    mongodbHelper = await connect()
  })

  beforeEach(async () => {
    user = await createUser()
    token = jwt.sign({ user }, process.env.JWT_SECRET as string)
  })

  afterEach(async () => {
    await mongodbHelper.clearDatabase()
  })

  afterAll(async () => {
    await mongodbHelper.closeDatabase()
  })

  it('POST /api/v1/books', async () => {
    const res = await createBook(token)

    expect(res.status).toEqual(201)
    expect(res.body).toHaveProperty('title', data.title)
  })

  it('GET /api/v1/books', async () => {
    await createBook(token)

    const res = await request(app).get('/api/v1/books')
    expect(res.status).toEqual(200)
    expect(res.body).toHaveLength(1)
  })

  it('GET /api/v1/books/:bookId', async () => {
    const response = await createBook(token)
    const book = response.body

    const res = await request(app).get(`/api/v1/books/${book._id}`)

    expect(res.status).toEqual(200)
    expect(res.body).toHaveProperty('title', book.title)
  })

  it('GET /api/v1/books/search', async () => {
    const response = await createBook(token)
    const book = response.body

    const field = 'all'
    const keyword = book.title

    const res = await request(app).get(
      `/api/v1/books/search?field=${field}&keyword=${keyword}`
    )

    expect(res.status).toEqual(200)
    expect(res.body).toHaveLength(1)
  })

  it('PUT /api/v1/books/:bookId/basicInfo', async () => {
    const response = await createBook(token)
    const book = response.body

    const update = {
      publisher: 'Independently published',
      publishedDate: new Date('2019-04-24'),
      title: 'Tess of the D\'Urbervilles',
      authors: ['Thomas Hardy'],
      ISBN13: '9781095725825',
      description:
        'Tess of the D\'Urbervilles: A Pure Woman Faithfully Presented is a novel by Thomas Hardy.',
      genres: ['Romance', 'Literary Fiction', 'Classic'],
    }

    const res = await request(app)
      .put(`/api/v1/books/${book._id}/basicInfo`)
      .set('Authorization', `Bearer ${token}`)
      .send(update)

    expect(res.status).toEqual(200)
    expect(res.body).toHaveProperty('publisher', update.publisher)
  })

  it('PUT /api/v1/books/:bookId/borrowInfo', async () => {
    const response = await createBook(token)
    const book = response.body

    const res = await borrowBook(user._id, book._id, token)

    expect(res.status).toEqual(200)
    expect(res.body).toHaveProperty('borrowerID')
    expect(String(res.body.borrowerID)).toEqual(String(user._id))
  })

  it('PUT /api/v1/books/:bookId/returnInfo', async () => {
    const response = await createBook(token)
    const book = response.body

    await borrowBook(user._id, book._id, token)

    const res = await request(app)
      .put(`/api/v1/books/${book._id}/returnInfo`)
      .set('Authorization', `Bearer ${token}`)
      .send({})

    expect(res.status).toEqual(200)
    expect(res.body).toHaveProperty('status', true)
  })

  it('PUT /api/v1/books/:bookId/image', async () => {
    const response = await createBook(token)
    const book = response.body

    const path = 'uploads/test/tess_new.jpg'

    const res = await request(app)
      .put(`/api/v1/books/${book._id}/image`)
      .set('Authorization', `Bearer ${token}`)
      .attach('image', path)

    expect(res.status).toEqual(200)
    expect(res.body).toHaveProperty('image')
    expect(res.body.image).toMatch(/tess_new\.jpg$/)
  })

  it('DELETE /api/v1/books/:bookId', async () => {
    const response = await createBook(token)
    const book = response.body

    const res = await request(app)
      .delete(`/api/v1/books/${book._id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toEqual(200)
    expect(res.body).toHaveProperty('title', book.title)
  })
})
