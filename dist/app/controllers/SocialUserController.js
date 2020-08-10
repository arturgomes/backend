"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);
var _validator = require('validator'); var _validator2 = _interopRequireDefault(_validator);
var _Feedback = require('../models/Feedback'); var _Feedback2 = _interopRequireDefault(_Feedback);
var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);
var _errors = require('../errors/errors'); var _errors2 = _interopRequireDefault(_errors);

class SocialUserController {
  store(req, res,next) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      user_id: Yup.string().required(),
      provider_type: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });
    if (
      !(schema.isValid({
        name: req.user.name,
        email: req.user.email,
        provider_type: req.user.provider_type,
        user_id: req.user.user_id,
      }))
    ) {
      return res.status(400).json({ error: _errors2.default.validation_failed });
    }
    const { fid } = req.body;
    const fc = fid ? 1 : 0
    const [user, created] = _User2.default.findOrCreate({
      where: {
        name: req.user.name,
        email: req.user.email,
        provider_type: req.user.provider_type,
        user_id: req.user.user_id,
        feedcoins: fc

      }
    });
    if (!created) {
      return res.status(400).json({ error: "could not create user" });
    }

    if (fid && _validator2.default.isUUID(fid)) {
      // console.log(`fid = ${fid}`);
      _Feedback2.default.findOne({
        id: fid,
      })
        .then(feed => {
          // console.log(feed);
          if (feed.user_id) {
            return res
              .status(400)
              .json({ error: _errors2.default.feedback_already_stored });
          }
          feed.update({
            user_id: user.id,
          });
          return res.json({ message: 'OK' });
        })
        // .catch(error => console.log(error));
        .catch(() => { });

    }
    next();
  }

}

exports. default = new SocialUserController();
