const path = require('path')
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan')
const exphbs = require('express-handlebars');
const findRemoveSync = require('find-remove');

// delete created sqlite dbs after 1 hour.
setInterval(() => {
    findRemoveSync(`${__dirname}/files`, { files: '*.*', age: { seconds: 3600 } });
}, 600000);

dotenv.config({ path: path.join(__dirname, '/config/config.env') });

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs')

app.use(express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/index'));

app.listen(PORT, console.log(`Server running on ${process.env.NODE_ENV} mode ON ${PORT}`));
