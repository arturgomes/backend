// import * as Yup from 'yup';
import User from '../models/User';
import Feedback from '../models/Feedback';
import Valid from 'validator';

// import Error from '../errors/errors';

class ManFeedControler {
  async index(req, res) {
    const { user_id } = req.params;
    const user = await User.findOne({ where: { id: user_id } });

    return res.json({ feedcoins: user.feedcoins });
  }

  async store(req, res) {
    const { fid, user_id} = req.body;

    if (fid && Valid.isUUID(fid)) {
      // console.log(fid)
      await Feedback.findByPk(fid)
        .then(feed => {
          // console.log(feed);
          if (feed.user_id!==null) {
            return res
              .status(400)
              .json({ error: Error.feedback_already_stored });
          }
          feed.update({ user_id});
          feed.save();
          // return res.json({ message: 'OK' });
        })
        .catch(() => {
          return res.status(500).json('nao achou nenhum feedback');
        });
        // console.log("feedback vazio!")

      await User.findByPk(user_id)
        .then(user => {
          // user.feedcoins = 1;
          const { id } = user.update({feedcoins:(user.feedcoins+1)});

          // console.log("teoricamente era pra incrementar");

          // console.log("update user: ", user)
        })
        .catch(error => {return res.status(500).json('nao achou nenhum feedback')});
    return res.json({ status: "ok" });
  }
}
}

export default new ManFeedControler();
