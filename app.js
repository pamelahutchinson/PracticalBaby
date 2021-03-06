const express = require('express')
const bodyParser = require('body-parser')
const models = require('./models')
const app = express()
const session = require('express-session')
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
const functions = require('./functions')
const saltRounds = 10;


app.use(session({
    secret: '1a2s3d',
    resave: false,
    saveUninitialized: true
}))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'))
app.use(cors())

app.use(bodyParser.json());

const database = {
    users: [
        {
            id: '123',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@gmail.com',
            username: 'JohnDoe123',
            password: 'cookies',
            joined: new Date()

        },
        {
            id: '124',
            firstName: 'Sally',
            lastName: 'Doe',
            email: 'sally@gmail.com',
            username: 'SallyDoe123',
            password: 'bananas',
            joined: new Date()

        }
    ],
    login: [
        {
            id: '987',
            hash: '',
            email: 'john@gmail.com'
        }
    ]
}

app.get('/', (req, res) => {
    res.send(database.users)
})

app.post('/loginwEmail', (req, res) => {
    const { email, password } = req.body;

    console.log(email)
    functions.user.getUserByEmail(email).then((userInfo) => {
        if (userInfo == null) {
            res.send('Not valid input')
        } else {
            console.log(userInfo.username)
            bcrypt.compare(password, userInfo.password, () => (res))
            if (res) {
                console.log('login succesful')
                req.session.userid = userInfo.id
                req.session.username = userInfo.username
                res.json(userInfo)
            } else {
                console.log(match)
                console.log(password)
                console.log('This is not working')
                console.log(userInfo.password)
            }
        }
    }
    )
})

app.post('/loginwUsername', (req, res) => {
    const { username, password } = req.body;

    console.log(username)
    functions.user.getUserByUsername(username).then((userInfo) => {
        if (userInfo == null) {
            res.send('Not valid input')
        } else {
            console.log(userInfo.username)
            bcrypt.compare(password, userInfo.password, () => (res))
            if (res) {
                console.log('login successful')
                req.session.userid = userInfo.id
                req.session.username = userInfo.username
                res.json(userInfo.id)
            } else {
                console.log(match)
                console.log(password)
                console.log('This is not working')
                console.log(userInfo.password)
            }
        }
    }
    )
})

// app.post('/login', (req, res) => {
//     console.log(req.body.email + " email")
//     console.log(req.body.username + " username")

//     if (req.body.email === database.users[0].email) {
//         if (req.body.password === database.users[0].password) {
//             res.json('success');
//         }
//     } else if (req.body.email === '') {
//         if (req.body.username === database.users[0].username && req.body.password === database.users[0].password) {
//             res.json('success');
//         }

//     } else {
//         res.status(400).json('error logging in');
//     }
// })


app.post('/register', function (req, res) {
    const { firstName, lastName, username, password, confirmPassword, email } = req.body;
    console.log('I am being called')
    // let errorMessage = null

    functions.user.addNewUser(firstName, lastName, username, password, email)
        .then(() => {
            res.json('registered')
        })

    // res.render('register', { message: errorMessage })
})



app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    })
    if (!found) {
        res.status(400).json('not found');
    }
})



app.listen(9000, () => {
    console.log('Server is running')
})
