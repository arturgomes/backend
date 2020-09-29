import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import authConfig from '../../config/auth.js';
import User from '../models/User.js';
import Retail from '../models/Retail.js';
import Error from '../errors/errors.js';

class SessionRetailController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: Error.validation_failed });
    }

    const { email, password } = req.body;

    const retail = await Retail.findOne({ where: { email } });

    if (!retail) {
      return res.status(401).json({ error: Error.user_not_found });
    }

    if (!(await retail.checkPassword(password))) {
      return res.status(401).json({ error: Error.password_not_match });
    }

    const { id, name } = retail;
    // console.log('retail logado');

    return res.json({
      login: {
        id,
        name,
        email,
        tu: 'b026324c6904b2a9cb4b88d6d61c81d1',
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionRetailController();
