// checks if we're running in the production enviorment. NODE_ENV will be set by default by Node.
if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

// Libraries
const express = require("express")
const app = express()
const expressLayouts = require("express-ejs-layouts")
const bodyParser = require('body-parser')
const methodOverride = require('method-override')


// Route handlers
const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authors')
const booksRouter = require("./routes/books")

/* A template engine enables you to use static template files in your application.
   At runtime, the template engine replaces variables in a template file with actual values, and transforms the template into an HTML file sent to the client.
   This approach makes it easier to design an HTML page. */
app.set("view engine", "ejs")
app.set("views", __dirname + "/views")

/* every single file is going to be put inside this layout file so we don't have to duplicate all the beggining html and ending html 
    of our project, such as the header and the footer. */
app.set("layout", "layouts/layout")
app.use(expressLayouts)
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
// the name '_method' will act like a name of an input in our form.
// since it's very unlikely that we'll have a form with the name '_method', that's the name we use here.
app.use(methodOverride('_method'))

const mongoose = require("mongoose")
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })

const db = mongoose.connection
db.on('err', (error) => console.log(error))
db.once('open', () => console.log("Connected to mongoose"))

app.use('/', indexRouter)
app.use('/authors', authorRouter)
app.use("/books", booksRouter)


app.listen(process.env.PORT || 3000)