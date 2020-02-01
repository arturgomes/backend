// import * as Yup from 'yup';
import User from '../models/User';
// import User from '../models/User';
// import Error from '../errors/errors';

class ManFeedControler {
  async index(req, res) {
    const { user_id } = req.params;
    const user = await User.findOne({ where: { id: user_id } });
    return res.json({ feedcoins: user.feedcoins });
  }

  async store(req, res) {
    const { user_id } = req.body;
    let resp;
    await User.findOne({ user_id })
      .then(user => {
        user.update({
          feedcoins: user.feedcoins + 1,
        });
        resp = user.feedcoins + 1;
      })
      .catch(() => {});

    return res.json({ feedcoins: resp });
  }
}

export default new ManFeedControler();
