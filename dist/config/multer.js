"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _multer = require('multer'); var _multer2 = _interopRequireDefault(_multer);
var _crypto = require('crypto'); var _crypto2 = _interopRequireDefault(_crypto);
var _path = require('path');
var _awssdk = require('aws-sdk'); var _awssdk2 = _interopRequireDefault(_awssdk);
var _multers3 = require('multer-s3'); var _multers32 = _interopRequireDefault(_multers3);


const storageTypes = {
  local: _multer2.default.diskStorage({
    destination: (req, file, cb) =>
      cb(null, _path.resolve.call(void 0, __dirname, '..', '..', 'tmp', 'uploads')),
    filename: (req, file, cb) => {
      _crypto2.default.randomBytes(16, (err, hash) => {
        if (err) return cb(err);

        file.key = `${hash.toString('hex')}-${file.originalname}`;

        return cb(null, file.key);
      });
    },
  }),
  s3: _multers32.default.call(void 0, {
    s3: new _awssdk2.default.S3(),
    bucket: 'cfeedbucket',
    contentType: _multers32.default.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (req, file, cb) => {
      _crypto2.default.randomBytes(16, (err, hash) => {
        if (err) return cb(err);

        const fileName = `${hash.toString('hex')}-${file.originalname}`;

        return cb(null, fileName);
      });
    },
  }),
};

exports. default = {
  dest: _path.resolve.call(void 0, __dirname, '..', '..', 'tmp', 'uploads'),
  storage: storageTypes[process.env.APP_STORAGE_TYPE],
  limit: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/pjpeg',
      'image/png',
      'image/gif',
      'application/pdf',
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
};
