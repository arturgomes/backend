"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var Yup = _interopRequireWildcard(require("yup"));

var _validator = _interopRequireDefault(require("validator"));

var _Feedback = _interopRequireDefault(require("../models/Feedback"));

var _User = _interopRequireDefault(require("../models/User"));

var _errors = _interopRequireDefault(require("../errors/errors"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class SocialUserController {
  store(req, res, next) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      user_id: Yup.string().required(),
      provider_type: Yup.string().required(),
      email: Yup.string().email().required()
    });

    if (!schema.isValid({
      name: req.user.name,
      email: req.user.email,
      provider_type: req.user.provider_type,
      user_id: req.user.user_id
    })) {
      return res.status(400).json({
        error: _errors.default.validation_failed
      });
    }

    const {
      fid
    } = req.body;
    const fc = fid ? 1 : 0;

    const [user, created] = _User.default.findOrCreate({
      where: {
        name: req.user.name,
        email: req.user.email,
        provider_type: req.user.provider_type,
        user_id: req.user.user_id,
        feedcoins: fc
      }
    });

    if (!created) {
      return res.status(400).json({
        error: "could not create user"
      });
    }

    if (fid && _validator.default.isUUID(fid)) {
      // console.log(`fid = ${fid}`);
      _Feedback.default.findOne({
        id: fid
      }).then(feed => {
        // console.log(feed);
        if (feed.user_id) {
          return res.status(400).json({
            error: _errors.default.feedback_already_stored
          });
        }

        feed.update({
          user_id: user.id
        });
        return res.json({
          message: 'OK'
        });
      }) // .catch(error => console.log(error));
      .catch(() => {});
    }

    next();
  }

}

var _default = new SocialUserController();

exports.default = _default;