"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Notification = _interopRequireDefault(require("../schemas/Notification"));

var _User = _interopRequireDefault(require("../models/User"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class NotificationController {
  async index(req, res) {
    const isProvider = await _User.default.findOne({
      where: {
        id: req.userId,
        provider: true
      }
    });

    if (!isProvider) {
      return res.status(401).json({
        error: 'only providers can load notifications'
      });
    }

    const notifications = await _Notification.default.find({
      user: req.userId
    }).sort({
      createdAt: 'desc'
    }).limit(20);
    return res.json(notifications);
  }

  async update(req, res) {
    // const notification = await Notification.findById(req.params.id);
    const notification = await _Notification.default.findByIdAndUpdate(req.params.id, {
      read: true
    }, {
      new: true
    });
    return res.json(notification);
  }

}

var _default = new NotificationController();

exports.default = _default;