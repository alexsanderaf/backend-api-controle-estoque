const express = require('express');
const app = express();
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()


const router = require('./routes/routes')

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

app.use('/storage', router);


app.listen(process.env.PORT);