"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }// import * as Yup from 'yup';
var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);
var _Feedback = require('../models/Feedback'); var _Feedback2 = _interopRequireDefault(_Feedback);
var _validator = require('validator'); var _validator2 = _interopRequireDefault(_validator);

// import Error from '../errors/errors';

class ManFeedControler {
  async index(req, res) {
    const { user_id } = req.params;
    const user = await _User2.default.findOne({ where: { id: user_id } });

    return res.json({ feedcoins: user.feedcoins });
  }

  async store(req, res) {
    const { fid, user_id} = req.body;

    if (fid && _validator2.default.isUUID(fid)) {
      // console.log(fid)
      await _Feedback2.default.findByPk(fid)
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

      await _User2.default.findByPk(user_id)
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

exports. default = new ManFeedControler();
