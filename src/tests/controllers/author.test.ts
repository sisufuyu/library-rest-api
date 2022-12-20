import request from 'supertest'
import { Request, Response, NextFunction } from 'express'

import app from '../../app'
import connect, { MongodbHelper } from '../../helpers/db-helper'

jest.mock('../../middlewares/authCheck', () => {
  return () => async (req: Request, res: Response, next: NextFunction) => {
    next()
  }
})

const data = {
  fullName: 'Thomas Hardy',
}

const createAuthor = async () => {
  return await request(app).post('/api/v1/authors').send(data)
}

describe('Author router', () => {
  let mongodbHelper: MongodbHelper

  beforeAll(async () => {
    mongodbHelper = await connect()
  })

  afterEach(async () => {
    await mongodbHelper.clearDatabase()
  })

  afterAll(async () => {
    await mongodbHelper.closeDatabase()
  })

  it('POST /api/v1/authors', async () => {
    const res = await createAuthor()

    expect(res.status).toEqual(201)
    expect(res.body).toHaveProperty('fullName', data.fullName)
  })

  it('GET /api/v1/authors', async () => {
    await createAuthor()

    const res = await request(app).get('/api/v1/authors')

    expect(res.status).toEqual(200)
    expect(res.body).toHaveLength(1)
  })

  it('GET /api/v1/authors/:authorId', async () => {
    const response = await createAuthor()
    const author = response.body

    const res = await request(app).get(`/api/v1/authors/${author._id}`)

    expect(res.status).toEqual(200)
    expect(res.body).toHaveProperty('fullName', author.fullName)
  })

  it('PUT /api/v1/authors/:authorId', async () => {
    const response = await createAuthor()
    const author = response.body

    const update = {
      fullName: 'Thomas Hardy',
      biography:
        'Thomas Hardy was an English author of the naturalist movement.',
    }

    const res = await request(app)
      .put(`/api/v1/authors/${author._id}`)
      .send(update)

    expect(res.status).toEqual(200)
    expect(res.body).toHaveProperty('fullName', update.fullName)
    expect(res.body).toHaveProperty('biography', update.biography)
  })

  it('DELETE /api/v1/authors/:authorId', async () => {
    const response = await createAuthor()
    const author = response.body

    const res = await request(app).delete(`/api/v1/authors/${author._id}`)

    expect(res.status).toEqual(200)
    expect(res.body).toHaveProperty('fullName', author.fullName)
  })
})
