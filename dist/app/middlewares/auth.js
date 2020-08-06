"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _util = require("util");

var _auth = _interopRequireDefault(require("../../config/auth"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: 'token not provided'
    });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await (0, _util.promisify)(_jsonwebtoken.default.verify)(token, _auth.default.secret);
    req.userId = decoded.id;
    return next();
  } catch (err) {
    return res.status(401).json({
      error: 'token invalid'
    });
  }
};

exports.default = _default;