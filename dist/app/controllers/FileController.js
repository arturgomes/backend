"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _File = _interopRequireDefault(require("../models/File"));

var _errors = _interopRequireDefault(require("../errors/errors"));

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var _multerS = _interopRequireDefault(require("multer-s3"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class FileController {
  async index(req, res) {
    const {
      retail_id
    } = req.params;
    const files = await _File.default.findAll({
      where: {
        retail_id
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
      retail_id
    } = req.body;
    const file = await _File.default.findOne({
      where: {
        retail_id
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

    const post = await _File.default.create({
      name: originalname,
      size,
      key,
      url: furl,
      retail_id: req.body.retail_id
    });
    return res.json(post); // return res.json(file)
  }

  async delete(req, res) {
    const id = req.params.id;
    const file = await _File.default.findOne({
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
    // await File.destory({where:{id}}).then(deletedOwner => {
    //   res.json(deletedOwner);
    // });

    return res.status(200).json({
      message: 'images deleted'
    });
  }

}

var _default = new FileController();

exports.default = _default;