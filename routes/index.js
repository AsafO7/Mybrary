const express = require("express")
const router = express.Router()

router.get('/', (req, res) => {
    // rendering the file index.ejs
    res.render("index")
})

module.exports = router