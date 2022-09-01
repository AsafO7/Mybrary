const express = require("express")
const router = express.Router()
const Author = require("../models/author")
const Book = require("../models/book")

// All authors route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if(req.query.name !== null && req.query.name !== '') {
        // A regular expression searches for just part of the text inside of our field in the simplest case
        // the 'i' flag means it's case insensitive.
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const authors = await Author.find(searchOptions)
        // The veriables in the object are are going to be sent to our ejs file.
        // That's why in the file index.ejs we can access the authors and searchOptions variables.
        res.render("authors/index", { authors: authors, searchOptions: req.query })
    }
    catch(err) {
        res.redirect('/')
    }
})

// New author route
router.get('/new', (req, res) => {
    // rendering the file new.ejs and sending it the variable author, which is a new Author object we can use in our ejs file
    res.render('authors/new', { author: new Author() })
})

// Create author route
router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name
    })
    try {
        const newAuthor = await author.save()
        res.redirect(`authors/${newAuthor.id}`)
    }
    catch(err) {
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating Author'
        })
    }
})

// Single Author Display
router.get('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        const books = await Book.find({ author: author.id }).limit(6).exec()
        res.render('authors/show', {
            author: author,
            booksByAuthor: books
        })
    }
    catch(err) {
        res.redirect('/')
    }
})

// Edit Author
router.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', { author: author })
    }
    catch(err) {
        res.redirect('/authors')
    }
})

// Update Author
router.put('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect(`/authors/${author.id}`)
    }
    catch(err) {
        if(author == null) {
            res.redirect('/')
        }
        else {
            res.render('authors/edit', {
                author: author,
                errorMessage: 'Error Updating Author'
            })
        }
    }
})

// Delete Author
router.delete('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        await author.remove()
        res.redirect(`/authors`)
    }
    catch(err) {
        if(author == null) {
            res.redirect('/')
        }
        else {
            res.redirect(`/authors/${author.id}`)
        }
    }
})

module.exports = router