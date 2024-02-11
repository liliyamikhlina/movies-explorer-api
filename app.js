const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const routes = require('./routes');
const errorMiddleware = require('./middlewares/errorMiddleware');
const NotFound = require('./errors/NotFound');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb');

app.use(routes);

app.get('/', (req, res) => {
  res.send('Добро пожаловать на сервер!');
});

app.use('*', (req, res, next) => {
  next(new NotFound('Данные по запросу не найдены'));
});

app.use(errors());

app.use(errorMiddleware);

app.listen(PORT);
