const path = require('path');
const express = require('express');
const morgan = require('morgan');
const { engine } = require('express-handlebars');
const db = require('./config/db');
const methodOverride = require('method-override');

// Connect to DB
db.connect();
const app = express();
const port = 1321;

//Route
const route = require('./routes');
const { mongo } = require('mongoose');

//Cookie Session
const session = require('express-session');
app.use(session({secret: '130921', resave: true, saveUninitialized: true}))
app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});

//Body-parser
app.use(
  express.urlencoded({
    extended: true,
  })
);

//Read file
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

//Method Override
app.use(methodOverride('_method'));

//HTTP logger
app.use(morgan('combined'));

//Template engine
app.engine(
  'hbs',
  engine({
    extname: '.hbs',
    helpers: {
      sum: (a, b) => a + b,
    },
  })
);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

// Route init
route(app);
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
