// Todo 1 - We'll use listed below
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongo = require('mongodb');
const mongoose = require('mongoose');

/* Todo 2 - We create Database in mongo
loginapp
and collection we use users
 */
// Todo 3 - We creeate connection to our database
mongoose.connect('mongodb://localhost/loginapp');
const db = mongoose.connection;

// Todo 4 - Initialize the app
const app = express();

// Todo 5 - We set Up our View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');




// Todo 6 - We Set up BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Todo 7 - We Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Todo 8 - Midleware for Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));


// Todo 14 - Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Todo 9 - Express Validator middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));

// Todo 10 - We Set Connect Flash
app.use(flash());

// Todo 11 - We Set some Global Vars for Flash Messages
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});



// Todo 12 - We create routes and Routes Middleware

var routes = require('./routes/index');
var users = require('./routes/users');


app.use('/', routes);
app.use('/users', users);


// Todo 13 - Set server and Port and Run
app.set('port', (process.env.PORT || 4000));

app.listen(app.get('port'), function(){
    console.log('Server started on port '+app.get('port'));
});


// Todo 15 - We create folder and files for routes-index
// Todo 16 - We Create views Folder and files
// Todo 17 - We create public folder
// Todo 18 - We create models folder

// Todo 21 - Install and add Bootstap css into public/style folder
// Todo 22 - Install and add Bootstap js into public/js folder
// Todo 23 - Install and add Bootstap fonts into public/fonts folder
// Todo 24 - Add styles and js into layout
// Todo 25 - Add Bootstrap Theme into layout.handlebars
// Todo 26 - create user register form in views/register.handlebars and edit routes/users
// Todo 27 - We will create user model