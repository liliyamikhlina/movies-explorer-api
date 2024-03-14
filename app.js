const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const routes = require('./routes');
const errorMiddleware = require('./middlewares/errorMiddleware');
const NotFound = require('./errors/NotFound');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://liliya.mikh.nomoredomainswork.ru',
    'https://api.liliya.mikh.nomoredomainswork.ru'],
  credentials: true,
}));

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(requestLogger);

app.get('/', (req, res) => {
  res.send('Добро пожаловать на сервер!');
});

app.use(routes);

app.use('*', (req, res, next) => {
  next(new NotFound('Данные по запросу не найдены'));
});

app.use(errorLogger);

app.use(errors());

app.use(errorMiddleware);

app.listen(PORT);
