import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import authConfig from '../../config/auth.js';
import User from '../models/User.js';
import Error from '../errors/errors.js';

class SocialSessionController {
  async store(req, res) {
    const user = await User.findOne({ where: { email:req.user.dataValues.email } });
    if (!user) {
      return res.status(401).json({ error: Error.user_not_found });
    }
      const { id, name } = user;
      // console.log('consumidor logado');
      return res.status(200).json({
        success: true,
        message: "user has successfully authenticated",
        login: {
          user_id: req.user.dataValued.user_id, //pass in the id and displayName params from Facebook
          name: req.user.dataValued.name,
          email: req.user.dataValued.email,
          tu: 'b026324c6904b2a9cb4b88d6d61c81d1',
        },
        token: jwt.sign({ id }, authConfig.secret, {
          expiresIn: authConfig.expiresIn,
        }),
      });
    }
  }


export default new SocialSessionController();
