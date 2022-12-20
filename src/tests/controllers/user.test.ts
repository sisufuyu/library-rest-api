import request from 'supertest'
import jwt from 'jsonwebtoken'

import app from '../../app'
import connect, { MongodbHelper } from '../../helpers/db-helper'
import { Role } from '../../type'

const data = {
  firstName: 'Anna',
  lastName: 'Wang',
  email: 'anna.wang@gmail.com',
  role: Role.ADMIN,
}

const createUser = async () => {
  return await request(app).post('/api/v1/users').send(data)
}

describe('User router', () => {
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

  it('POST /api/v1/users', async () => {
    const res = await createUser()

    expect(res.status).toEqual(201)
    expect(res.body).toHaveProperty('firstName', data.firstName)
    expect(res.body).toHaveProperty('lastName', data.lastName)
    expect(res.body).toHaveProperty('email', data.email)
  })

  it('GET /api/v1/users', async () => {
    await createUser()

    const res = await request(app).get('/api/v1/users')

    expect(res.status).toEqual(200)
    expect(res.body).toHaveLength(1)
  })

  it('GET /api/v1/users/:userId', async () => {
    const response = await createUser()
    const user = response.body

    const res = await request(app).get(`/api/v1/users/${user._id}`)

    expect(res.status).toEqual(200)
    expect(res.body).toHaveProperty('firstName', user.firstName)
    expect(res.body).toHaveProperty('lastName', user.lastName)
    expect(res.body).toHaveProperty('email', user.email)
  })

  it('PUT /api/v1/users/:userId', async () => {
    const response = await createUser()
    const user = response.body

    const update = {
      firstName: 'Lisa',
      lastName: 'Chou',
    }

    const token = jwt.sign({ user }, process.env.JWT_SECRET as string)
    const res = await request(app)
      .put(`/api/v1/users/${user._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(update)

    expect(res.status).toEqual(200)
    expect(res.body).toHaveProperty('firstName', update.firstName)
    expect(res.body).toHaveProperty('lastName', update.lastName)
  })

  it('DELETE /api/v1/users/:userId', async () => {
    const response = await createUser()
    const user = response.body

    const token = jwt.sign({ user }, process.env.JWT_SECRET as string)
    const res = await request(app)
      .delete(`/api/v1/users/${user._id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toEqual(204)
  })
})
