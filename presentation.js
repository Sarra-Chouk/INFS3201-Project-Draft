const express = require('express');
const business = require('./business.js');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');

const app = express();
app.set('views', __dirname + "/templates");
app.set('view engine', 'handlebars');

// Set up Handlebars with the main layout and specify layout directory
app.engine('handlebars', handlebars.engine({
    defaultLayout: 'main',
    layoutsDir: __dirname + '/templates'
}));
app.use(express.static(__dirname + '/css'));

let urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(urlencodedParser);


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


app.listen(8000, () => {
    console.log("Application started");
});
