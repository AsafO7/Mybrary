const express = require("express")
const multer = require('multer')
const router = express.Router()
const path = require('path')
const fs = require('fs') // We use this library in case there's an error creating a book, we don't want to save its cover file.
const Book = require('../models/book')
const Author = require('../models/author')
const uploadPath = path.join('public', Book.coverImageBasePath)
const imageMineTypes = ['image/jpeg', 'image/png', 'image/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMineTypes.includes(file.mimetype))
    }
})

// All books route
router.get('/', async (req, res) => {
    // Book.find() returns a query object which we can build a query from and then execute later.
    let query = Book.find()
    // Did the user pass a valid title?
    if(req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if(req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.lte('publishDate', req.query.publishedBefore)
    }
    if(req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.gte('publishDate', req.query.publishedAfter)
    }
    try {
        const books = await query.exec()
        res.render('books/index', {
            books: books,
            searchOptions: req.query
        })
    }
    catch(err) {
        res.redirect('/')
    }
})

// new book route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book())
})

// upload.single('cover') means taking our upload variable, telling it we have a single file being uploaded in this form, 
// and it has the file name of 'cover' (what you set your input name to be (in _form_fields file)).
router.post('/', upload.single('cover'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName: fileName,
        description: req.body.description
        // we don't put the coverImage property here because we first need to create the cover image file on our file system,
        // get the name from that and then save it into our book object.
        // The easiest way to do that is to install a library called "multer".
        // multer allows us to work with multi-part forms.
    })
    try {
        const newBook = await book.save()
        // res.redirect(`books/${newBook.id}`)
        res.redirect('books')
    }
    catch(err) {
        if(book.coverImageName != null) {
            removeBookCover(book.coverImageName)
        }
        renderNewPage(res, book, true)
    }
})

function removeBookCover(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if(err) console.error(err)
    })
}

async function renderNewPage(res, book, hasError = false) {
    try {
        const authors = await Author.find({})
        const params = {
            authors: authors,
            book: book
        }
        if(hasError) {
            params.errorMessage = 'Error creating book'
        }
        res.render('books/new', params)
    }
    catch(err) {
        res.redirect('/books')
    }
}

module.exports = router