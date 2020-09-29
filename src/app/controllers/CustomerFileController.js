import FileUser from '../models/FileUser.js';
import Error from '../errors/errors.js';
import aws from 'aws-sdk';
import multerS3 from 'multer-s3';

class FileUserController {
  async index(req,res){
    const { user_id } = req.params;
    const files = await FileUser.findAll({where:{ user_id} })
    return res.json(files);
  }

  async store(req, res) {
    const {originalname, size, key, location: furl=''} = req.file;
    const { user_id } = req.body;
    const file = await FileUser.findOne({ where: { user_id} });

    if(file){
      var s3 = new aws.S3();
      var params = {
        Bucket: 'cfeedbucket',
        Key: file.key
      };

      s3.deleteObject(params, err => {
        if (err) { console.log(err); }
      });
      file.destroy();
    }

    const post = await FileUser.create({
      name:originalname, size,key,url:furl,
      user_id: req.body.user_id,
    });

    return res.json(post)
    // return res.json(file)

  }

  async delete(req,res){
    const id = req.params.id;

    const file = await FileUser.findOne({ where: { id} });
    var s3 = new aws.S3();
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

export default new FileUserController();
