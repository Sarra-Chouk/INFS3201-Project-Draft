const express = require('express');
const business = require('./business.js');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');

let app = express()
app.set('views', __dirname+"/templates")
app.set('view engine', 'handlebars')
app.engine('handlebars', handlebars.engine())
app.use(bodyParser.urlencoded({extended: false}))

app.get('/', (req, res) => {
    let message = req.query.message
    res.render('signup', {
        message: message
    })
})

// Route: Display signup page
app.get('/signup', (req, res) => {
    res.render('signup');
});

// Route: Handle signup form submission
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
        return res.render('signup', { error: 'All fields are required'  });
    }
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.listen(8000, () => {
    console.log("Application started");
});
