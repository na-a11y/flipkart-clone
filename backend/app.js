const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const errorMiddleware = require('./middlewares/error');
const cors=require('cors');
const app = express();
const dotenv=require('dotenv').config({ path: './config/.env' });


// config
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: 'backend/config/config.env' });
}

app.use(express.json());
app.use(cookieParser('secret'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(cors({credentials: true, origin: true, withCredentials: true }))
// app.use(dotenv())


const user = require('./routes/userRoute');
const product = require('./routes/productRoute');
const order = require('./routes/orderRoute');


app.use('/api/v1', user);
app.use('/api/v1', product);
app.use('/api/v1', order); 
 

// deployment
__dirname = path.resolve();
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    });
} else {
    app.get('/', (req, res) => {
          res.send('server on');
    });
}

// error middleware
app.use(errorMiddleware);

module.exports = app;