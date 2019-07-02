const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();

// connection Database
mongoose.connect('mongodb://localhost/cotabox')
        .then(db => console.log ('DB is Connected'))
        .catch(err => console.error(err));

// Settings

app.set('port', process.env.PORT || 3000);

// Middlewares

app.use(morgan('dev'));
app.use(express.json());

//Routes

app.use('/api/tasks', require('./routes/tasks'));

// Static files

app.use(express.static(__dirname + '/public'));

// Server is listening

app.listen(app.get('port'), () =>{
    console.log('Server on Port', app.get('port'));
});






