# Library Management System - REST API

## About the project
This is a library management system fullstack project (back-end part) I made in Integrify fullstack program. From this project, I practiced how to write a REST API using Node.js, Express.js, TypeScript and connect to MongoDB database. I gained deep understanding about REST API, routing, controller and security through this project. 

## Prerequisites
This project is built with Express framework, to install and run this project locally, you need to install Node.js first.

## Installation & Run the project locally
1. Download the project or clone the repo
  git clone https://github.com/sisufuyu/library-rest-api.git

2. Install NPM packages
  npm install

3. create a .env file with following values and add your root directory
  ``` 
  MONGODB_URI=YOUR OWN MONGO DATABASE URL
  PORT=4000
  GOOGLE_CLIENT_ID=YOUR OWN GOODLE CLIENT ID
  JWT_SECRET=YOUR OWN JWT SECRET VALUE 
  ```
  
4. run with command
  npm run start


## Endpoints
**Book**
  * GET /api/v1/books Get all books
  * GET /api/v1/books/:bookId Get book with id
  * PUT /api/v1/books/:bookId/basicInfo Update book basic information
  * PUT /api/v1/books/:bookId/borrowInfo Update book borrow information
  * PUT /api/v1/books/:bookId/returnInfo Update book return information
  * PUT /api/v1/books/:bookId/image Update book cover image 
  * POST /api/v1/books Creat a new book
  * DELETE /api/v1/books/:bookId Delete a book with id

**Author**
  * GET /api/v1/authors Get all authors
  * GET /api/v1/authors/:authorId Get an author with id
  * PUT /api/v1/authors/:authorId Update author basic information
  * POST /api/v1/authors Creat a new author
  * DELETE /api/v1/authors/:authorId Delete an author with id
  
**User**
  * GET /api/v1/users Get all users
  * GET /api/v1/users/:userId Get an user with id
  * PUT /api/v1/users/:userId Update user basic information
  * POST /api/v1/users Creat a new user
  * DELETE /api/v1/users/:userId Delete an user with id
