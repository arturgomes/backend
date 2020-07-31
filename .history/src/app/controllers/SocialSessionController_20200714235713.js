import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import authConfig from '../../config/auth';
import User from '../models/User';
import Retail from '../models/Retail';
import Error from '../errors/errors';

class SocialSessionController {
  async store(req, res) {
    const user = await User.findOne({ where: { email } });

    if (!user && !retail) {
      return res.status(401).json({ error: Error.user_not_found });
    }

    if (user) {
      if (!(await user.checkPassword(password))) {
        return res.status(401).json({ error: Error.password_not_match });
      }

      const { id, name } = user;
      // console.log('consumidor logado');

      return res.json({
        login: {
          id,
          name,
          email,
          tu: '897316929176464ebc9ad085f31e7284',
        },
        token: jwt.sign({ id }, authConfig.secret, {
          expiresIn: authConfig.expiresIn,
        }),
      });
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

export default new SocialSessionController();
