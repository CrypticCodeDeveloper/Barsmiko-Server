const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const blogsRouter = require('./routes/blogs')
const authRouter = require('./routes/auth')
require("express-async-handler")
const cors = require('cors')

const app = express();

app.use("/static", express.static(path.join(__dirname, "uploads")))

console.log(__dirname)

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())

const origin = process.env.NODE_ENV === "development" ?
"http://localhost:5173" :
process.env.LIVE_API_URL;

app.use(cors({
    origin,
}))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/blogs', blogsRouter);
app.use('/auth', authRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
    console.log(err)
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Something went wrong",
  });
});


module.exports = app;
