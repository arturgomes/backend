import File from '../models/File.js';
import Error from '../errors/errors.js';
import aws from 'aws-sdk';
import multerS3 from 'multer-s3';

class FileController {
  async index(req,res){
    const { retail_id } = req.params;
    const files = await File.findAll({where:{ retail_id} })
    return res.json(files);

  }
  async store(req, res) {
    const {originalname, size, key, location: furl=''} = req.file;
    const { retail_id } = req.body;

    const file = await File.findOne({ where: { retail_id} });
    if(file){
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
    }
    const post = await File.create({
      name:originalname, size,key,url:furl,
      retail_id: req.body.retail_id,

    });

    return res.json(post)
    // return res.json(file)

  }

  async delete(req,res){
    const id = req.params.id;

    const file = await File.findOne({ where: { id} });
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
    // await File.destory({where:{id}}).then(deletedOwner => {
    //   res.json(deletedOwner);
    // });


    return res.status(200).json({
      message: 'images deleted',
    });
  }
}

export default new FileController();
