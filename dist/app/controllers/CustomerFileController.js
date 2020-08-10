"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _FileUser = require('../models/FileUser'); var _FileUser2 = _interopRequireDefault(_FileUser);
var _errors = require('../errors/errors'); var _errors2 = _interopRequireDefault(_errors);
var _awssdk = require('aws-sdk'); var _awssdk2 = _interopRequireDefault(_awssdk);
var _multers3 = require('multer-s3'); var _multers32 = _interopRequireDefault(_multers3);

class FileUserController {
  async index(req,res){
    const { user_id } = req.params;
    const files = await _FileUser2.default.findAll({where:{ user_id} })
    return res.json(files);
  }

  async store(req, res) {
    const {originalname, size, key, location: furl=''} = req.file;
    const { user_id } = req.body;
    const file = await _FileUser2.default.findOne({ where: { user_id} });

    if(file){
      var s3 = new _awssdk2.default.S3();
      var params = {
        Bucket: 'cfeedbucket',
        Key: file.key
      };

      s3.deleteObject(params, err => {
        if (err) { console.log(err); }
      });
      file.destroy();
    }

    const post = await _FileUser2.default.create({
      name:originalname, size,key,url:furl,
      user_id: req.body.user_id,
    });

    return res.json(post)
    // return res.json(file)

  }

  async delete(req,res){
    const id = req.params.id;

    const file = await _FileUser2.default.findOne({ where: { id} });
    var s3 = new _awssdk2.default.S3();
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


    // await
    // await FileUser.destory({where:{id}}).then(deletedOwner => {
    //   res.json(deletedOwner);
    // });


    return res.status(200).json({
      message: 'images deleted',
    });
  }
}

exports. default = new FileUserController();
