const mongoose = require("mongoose")
const Book = require('./book')

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

// Before calling remove() in authors.js in the function router.delete(), run this code.
authorSchema.pre('remove', function(next) {
    Book.find({ author: this.id}, (err, books) => {
        if(err) next(err) // In case we can't connect to the db
        else if(books.length > 0) { // In case the author still has books in the db
            next(new Error("This author has books still"))
        }
        else next() // Everything is ok, you can proceed with the removal.
    })
})

module.exports = mongoose.model('Author', authorSchema)