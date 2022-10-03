// Imports
import express from 'express'
import { body, validationResult } from 'express-validator'
import { guestbookData } from './data.js'

// Create an express app with the express() function
const app = express()
// Set the port
const PORT = 8000

// Set ejs as template/view/render engine
app.set('view engine', 'ejs')

// Request logging with middleware
app.use((req, _, next) => {
    console.log('Request:', req.method, req.url)
    next()
})

// express.static middleware to serve static files from directory
app.use(express.static('./public'))
// middleware function that parses incoming requests
app.use(express.urlencoded({ extended: true }))

// render 'index' when request URL/
app.get('/', (req, res) => {
    res.render('index', { guestbookData, error: null })
})

app.post('/add',
    body('email').isEmail(),
    body('firstname').isLength({ min: 2, max: 50 }),
    body('lastname').isLength({ min: 2, max: 50 }),
    body('comment').isLength({ min: 5, max: 500 }),
    (req, res) => {
        // Finds the validation errors in requests and wraps them in object with functions
        const valErrors = validationResult(req);
        if (!valErrors.isEmpty()) {
            return res.render('index', { guestbookData, error: valErrors })
        }

        guestbookData.push({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            comment: req.body.comment
        })
        res.render('index', { guestbookData, error: null })
        console.log(guestbookData)
    }
)

// Server is listening on chosen port
app.listen(PORT, () => console.log('Server runs on Port:', PORT))