import jwt from 'jsonwebtoken';
import { promisify } from 'util';

export default async (req, res, next) => {
  app.all('/', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    next();
  });
};
