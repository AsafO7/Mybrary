const mongoose = require("mongoose")

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    publishDate: {
        type: Date,
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    coverImage: {
        type: Buffer,
        require: true
    },
    coverImageType: {
        type: String,
        required: true,
    },
    author: {
        // This is referencing the id of the Author object (it tells mongoose that this is referencing another object inside our collections)
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // saying we're referencing the Author collection (THIS NAME MUST BE THE SAME AS THE ONE WE GAVE THE MODEL (like how in models -> author.js we gave it the name of Author))
        ref: "Author"
    }
})

/* this function will allow us to create a virtual property.
   This property's value will be derived from the values of the other properties (title, page, count, etc...) */
// We use a normal function inside get() instead of an arrow function because we need to access the "this" keyword.
bookSchema.virtual('coverImagePath').get(function() {
    if(this.coverImage != null && this.coverImageType != null) {
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
})

module.exports = mongoose.model('Book', bookSchema)