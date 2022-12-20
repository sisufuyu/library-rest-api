import ISBN from 'isbn-utils'

export const isISBN13 = (isbn: string) => {
  const isbn13 = ISBN.parse(isbn)
  return isbn13?.isIsbn13()
}

export const genreList = [
  'Action & Adventure',
  'Fantasy',
  'Science Fiction',
  'Classic',
  'Suspense & Thriller',
  'Horror',
  'Detective & Mystery',
  'Romance',
  'Young Adult',
  'Poetry',
  'Comic Book & Graphic Novel',
  'Historical Fiction',
  'Literary Fiction',
  'Comedy',
  'Self-Help',
  'Biography & Autobiography',
  'History',
  'Cookbook',
  'True Crime',
]
