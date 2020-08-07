console.clear();
/*
  Step 1: Create a new express app
*/
const express = require('express');
const app = express();

require('dotenv').config();
const path = require('path');
/*
  Step 2: Setup Mongoose (using environment variables)
*/
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URI, {
      auth: {
        user: process.env.DB_USER,
        password: process.env.DB_PASS
      },
      useCreateIndex:true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
}).catch(err => console.error(`Error: ${error}`));

/*
  Step 3: Setup and configure Passport
*/
const passport = require('passport');
const session = require('express-session');
app.use(session({
    secret: 'any salty secret here',
    resave: true,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
const User = require(`./models/User`);
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/*
  Step 4: Setup the asset pipeline, path, the static paths,
  the views directory, and the view engine
*/

app.use('/css', express.static('assets/css'));
app.use('/javascript', express.static('assets/javascript'));
app.use('/images', express.static('assets/images'));

app.set('views',path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


/*
  Step 5: Setup the body parser
*/
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/*
  Step 6: Setup our flash helper, default locals, and local helpers (like formData and authorized)
*/
const flash = require('connect-flash');
app.use(flash());
app.use('/', (req,res,next) => {
     res.locals.pageTitle = "Untitled";
     res.locals.flash = req.flash();
     console.log(req.session.formData);
     res.locals.formData = req.session.formData || {};
     req.session.formData = {};
     res.locals.authorized = req.isAuthenticated();
     if(res.locals.authorized) res.locals.email = req.session.passport.user;
     next();
});

/*
  Step 7: Register our route composer
*/
const routes = require('./routes.js');
const { appendFileSync } = require('fs');

app.use('/api', routes);

//instructions for production
app.use(express.static(path.join(__dirname, 'client/build')));
app.get('*', (req,res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

/*
  Step 8: Start the server
*/
//for development port 4000 is used 
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}`));
