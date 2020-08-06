"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const NotificationSchema = new _mongoose.default.Schema({
  content: {
    type: String,
    required: true
  },
  user: {
    type: Number,
    required: true
  },
  read: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  timestamps: true
});

var _default = _mongoose.default.model('Notification', NotificationSchema);

exports.default = _default;