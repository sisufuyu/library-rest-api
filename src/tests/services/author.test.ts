import authorService from '../../services/author.service'
import connect, { MongodbHelper } from '../../helpers/db-helper'
import { AuthorDocument } from '../../type'

const data = [
  {
    fullName: 'Thomas Hardy',
    biography:
      'Thomas Hardy was born in a cottage in Higher Bockhampton, near Dorchester, on 2 June 1840. He was educated locally and at sixteen was articled to a Dorchester architect, John Hicks. In 1862 he moved to London and found employment with another architect, Arthur Blomfield. He now began to write poetry and published an essay.',
  },
  {
    fullName: 'Margaret Atwood',
    biography: '',
  },
]

describe('Author service', () => {
  let mongodbHelper: MongodbHelper
  let author: AuthorDocument

  beforeAll(async () => {
    mongodbHelper = await connect()
  })

  beforeEach(async () => {
    author = await authorService.createAuthor(data[0])
    await authorService.createAuthor(data[1])
  })

  afterEach(async () => {
    await mongodbHelper.clearDatabase()
  })

  afterAll(async () => {
    await mongodbHelper.closeDatabase()
  })

  test('should create a author', () => {
    expect(author).toHaveProperty('_id')
    expect(author).toHaveProperty('fullName', data[0].fullName)
  })

  test('should find all authors', async () => {
    const authors = await authorService.findAllAuthors()

    expect(authors).toHaveLength(2)
  })

  test('should get a author by Id', async () => {
    const findAuthor = await authorService.findAuthorById(author._id)

    expect(findAuthor).toHaveProperty('fullName', author.fullName)
  })

  test('should get a author by name', async () => {
    const findAuthor = await authorService.findAuthorByName(data[0].fullName)

    expect(findAuthor).toHaveProperty('_id')
    expect(findAuthor).toHaveProperty('biography', data[0].biography)
  })
})
