"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _FileUser = _interopRequireDefault(require("../models/FileUser"));

var _errors = _interopRequireDefault(require("../errors/errors"));

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var _multerS = _interopRequireDefault(require("multer-s3"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class FileUserController {
  async index(req, res) {
    const {
      user_id
    } = req.params;
    const files = await _FileUser.default.findAll({
      where: {
        user_id
      }
    });
    return res.json(files);
  }

  async store(req, res) {
    const {
      originalname,
      size,
      key,
      location: furl = ''
    } = req.file;
    const {
      user_id
    } = req.body;
    const file = await _FileUser.default.findOne({
      where: {
        user_id
      }
    });

    if (file) {
      var s3 = new _awsSdk.default.S3();
      var params = {
        Bucket: 'cfeedbucket',
        Key: file.key
      };
      s3.deleteObject(params, err => {
        if (err) {
          console.log(err);
        }
      });
      file.destroy();
    }

    const post = await _FileUser.default.create({
      name: originalname,
      size,
      key,
      url: furl,
      user_id: req.body.user_id
    });
    return res.json(post); // return res.json(file)
  }

  async delete(req, res) {
    const id = req.params.id;
    const file = await _FileUser.default.findOne({
      where: {
        id
      }
    });
    var s3 = new _awsSdk.default.S3();
    var params = {
      Bucket: 'cfeedbucket',
      Key: file.key
    };
    s3.deleteObject(params, err => {
      if (err) {
        console.log(err);
      }
    });
    file.destroy(); // await
    // await FileUser.destory({where:{id}}).then(deletedOwner => {
    //   res.json(deletedOwner);
    // });

    return res.status(200).json({
      message: 'images deleted'
    });
  }

}

var _default = new FileUserController();

exports.default = _default;