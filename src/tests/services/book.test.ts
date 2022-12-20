import { BookDocument } from '../../type'
import bookService from '../../services/book.service'
import authorService from '../../services/author.service'
import connect, { MongodbHelper } from '../../helpers/db-helper'

const bookList = [
  {
    title: 'And Then There Were None',
    authors: ['Agatha Christie'],
    description:
      'If you\'re one of the few who haven\'t experienced the genius of Agatha Christie, this novel is a stellar starting point.',
    ISBN13: '9780062073488',
    publisher: 'William Morrow & Company; Reissue edition',
    publishedDate: new Date('2011-03-01'),
    genres: ['Detective & Mystery', 'Classic'],
    image: 'uploads/books/1665700173443-16299._SY475_.jpg',
  },
  {
    title: 'Carrie',
    authors: ['Stephen King'],
    description:
      'Stephen King\'s legendary debut, about a teenage outcast and the revenge she enacts on her classmates.',
    ISBN13: '9780307743664',
    publisher: 'Anchor Books',
    publishedDate: new Date('2011-08-31'),
    genres: ['Horror', 'Classic'],
    image: 'uploads/books/1665700256937-10592._SY475_.jpg',
  },
]

describe('Book service', () => {
  let mongodbHelper: MongodbHelper
  let book1: BookDocument
  let book2: BookDocument

  beforeAll(async () => {
    mongodbHelper = await connect()
  })

  beforeEach(async () => {
    const authorIds1 = await authorService.getAuthorsByName(bookList[0].authors)
    book1 = await bookService.createBook({
      ...bookList[0],
      authors: authorIds1,
    })

    const authorIds2 = await authorService.getAuthorsByName(bookList[1].authors)
    book2 = await bookService.createBook({
      ...bookList[1],
      authors: authorIds2,
    })
  })

  afterEach(async () => {
    await mongodbHelper.clearDatabase()
  })

  afterAll(async () => {
    await mongodbHelper.closeDatabase()
  })

  test('should create a book', () => {
    expect(book1).toHaveProperty('_id')
    expect(book1).toHaveProperty('title', 'And Then There Were None')
  })

  test('should get books', async () => {
    const books = await bookService.findAllBooks()
    expect(books).toHaveLength(2)
  })

  test('should get a book by Id', async () => {
    const findBook = await bookService.findBookById(book1._id)

    expect(findBook).toHaveProperty('title', book1.title)
  })

  test('should delete a book by Id', async () => {
    const deleteBook = await bookService.deleteBook(book1._id)

    expect(deleteBook).toHaveProperty('title', book1.title)
  })

  test('should update a book by Id', async () => {
    const update = {
      publisher: 'Pocket Books',
      publishedDate: new Date('2005-11-01'),
      ISBN13: '9781416524304',
    }

    const updateBook = await bookService.updateBook(book2._id, update)
    expect(updateBook).toHaveProperty('publisher', update.publisher)
    expect(updateBook).toHaveProperty('publishedDate', update.publishedDate)
    expect(updateBook).toHaveProperty('ISBN13', update.ISBN13)
  })

  test('should find a book by ISBN', async () => {
    const findBook = await bookService.findBookByISBN(book2.ISBN13)

    expect(findBook).toHaveProperty('title', book2.title)
    expect(findBook).toHaveProperty('ISBN13', book2.ISBN13)
  })

  test('should find books by title', async () => {
    const findBooks = await bookService.findBooksByTitle('Carrie')

    expect(findBooks).toHaveLength(1)
  })

  test('should find one book by author id', async () => {
    const findBook = await bookService.findOneBookByAuthorId(
      String(book1.authors[0])
    )

    expect(findBook).toHaveProperty('title', book1.title)
  })

  test('should find books by author id', async () => {
    const findBooks = await bookService.findBooksByAuthorIds(book1.authors)

    expect(findBooks).toHaveLength(1)
  })
})
