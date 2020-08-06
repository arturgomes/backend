"use strict";

var _Queue = _interopRequireDefault(require("./lib/Queue"));

require("dotenv/config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_Queue.default.processQueue();