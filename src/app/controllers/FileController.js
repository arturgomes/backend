import File from '../models/File';
import Error from '../errors/errors';

class FileController {
  async index(req,res){
    const files = await File.findAll();
    return res.json(files);
  }
  async store(req, res) {
    const {originalname:name, size, key, location: url=''} = req.file;
    const {retail_id} = req.body;
    console.log("key: ",key);
    const file = await File.create({
      name,size,key,url,retail_id
    });
    return res.json(file)

  }
  async delete(req,res){
    const id = req.params.id;
    const file = await File.findByPk(id).then((i) => {
      return i.destroy();
    });
    console.log(file);
    // await File.destory({where:{id}}).then(deletedOwner => {
    //   res.json(deletedOwner);
    // });;
    return res.status(200).json({message:"deletado"});
  }
}

export default new FileController();
