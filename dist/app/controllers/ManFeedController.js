"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _User = _interopRequireDefault(require("../models/User"));

var _Feedback = _interopRequireDefault(require("../models/Feedback"));

var _validator = _interopRequireDefault(require("validator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import * as Yup from 'yup';
// import Error from '../errors/errors';
class ManFeedControler {
  async index(req, res) {
    const {
      user_id
    } = req.params;
    const user = await _User.default.findOne({
      where: {
        id: user_id
      }
    });
    return res.json({
      feedcoins: user.feedcoins
    });
  }

  async store(req, res) {
    const {
      fid,
      user_id
    } = req.body;

    if (fid && _validator.default.isUUID(fid)) {
      // console.log(fid)
      await _Feedback.default.findByPk(fid).then(feed => {
        // console.log(feed);
        if (feed.user_id !== null) {
          return res.status(400).json({
            error: Error.feedback_already_stored
          });
        }

        feed.update({
          user_id
        });
        feed.save(); // return res.json({ message: 'OK' });
      }).catch(() => {
        return res.status(500).json('nao achou nenhum feedback');
      }); // console.log("feedback vazio!")

      await _User.default.findByPk(user_id).then(user => {
        // user.feedcoins = 1;
        const {
          id
        } = user.update({
          feedcoins: user.feedcoins + 1
        }); // console.log("teoricamente era pra incrementar");
        // console.log("update user: ", user)
      }).catch(error => {
        return res.status(500).json('nao achou nenhum feedback');
      });
      return res.json({
        status: "ok"
      });
    }
  }

}

var _default = new ManFeedControler();

exports.default = _default;