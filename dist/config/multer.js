"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _multer = _interopRequireDefault(require("multer"));

var _crypto = _interopRequireDefault(require("crypto"));

var _path = require("path");

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var _multerS = _interopRequireDefault(require("multer-s3"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const storageTypes = {
  local: _multer.default.diskStorage({
    destination: (req, file, cb) => cb(null, (0, _path.resolve)(__dirname, '..', '..', 'tmp', 'uploads')),
    filename: (req, file, cb) => {
      _crypto.default.randomBytes(16, (err, hash) => {
        if (err) return cb(err);
        file.key = `${hash.toString('hex')}-${file.originalname}`;
        return cb(null, file.key);
      });
    }
  }),
  s3: (0, _multerS.default)({
    s3: new _awsSdk.default.S3(),
    bucket: 'cfeedbucket',
    contentType: _multerS.default.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (req, file, cb) => {
      _crypto.default.randomBytes(16, (err, hash) => {
        if (err) return cb(err);
        const fileName = `${hash.toString('hex')}-${file.originalname}`;
        return cb(null, fileName);
      });
    }
  })
};
var _default = {
  dest: (0, _path.resolve)(__dirname, '..', '..', 'tmp', 'uploads'),
  storage: storageTypes[process.env.APP_STORAGE_TYPE],
  limit: {
    fileSize: 2 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif', 'application/pdf'];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
};
exports.default = _default;