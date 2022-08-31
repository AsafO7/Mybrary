const express = require("express")
const router = express.Router()
const Author = require("../models/author")

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
        // res.redirect(`authors/${newAuthor.id}`)
        res.redirect('authors')
    }
    catch(err) {
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating Author'
        })
    }
})

module.exports = router