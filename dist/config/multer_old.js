"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _multer = _interopRequireDefault(require("multer"));

var _crypto = _interopRequireDefault(require("crypto"));

var _path = require("path");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  storage: _multer.default.diskStorage({
    destination: (0, _path.resolve)(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      _crypto.default.randomBytes(16, (err, res) => {
        if (err) return cb(err); // null eh o erro, primeiro parametro

        return cb(null, res.toString('hex') + (0, _path.extname)(file.originalname));
      });
    }
  })
};
exports.default = _default;