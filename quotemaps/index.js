const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const morgan = require('morgan');

// IMPORT MODELS
require('./models/User');

const app = express();

const MONGO_URI = 'mongodb+srv://quotemaps:pF98nmrWPGF45@cluster0-9sm57.mongodb.net/quotemaps?retryWrites=true&w=majority';
mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev'));

// Use sessions for tracking logins
app.use(session({
  secret: 'the cake is a lie',
  resave: true,
  saveUninitialized: false
}));

// IMPORT ROUTES
require('./routes/users')(app);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
  
    const path = require('path');
    app.get('*', (req,res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
  
  }

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`)
});