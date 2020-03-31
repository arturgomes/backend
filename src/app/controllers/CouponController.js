import * as Yup from 'yup';
import Coupon from '../models/Coupon';
import Error from '../errors/errors';

class CouponController {
  async index(req,res){
    const {retail_id} = req.params;


    const coupons = await Coupon.findAll({where:{retail_id}});
    if(!coupons){
      return res.status(400).json({ error: "no coupons found for this retail" });
    }
    return res.json(coupons);
  }
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      description: Yup.string().required(),
      discount: Yup.string().required(),
      expireDate: yup.date().required()
    });

    if (
      !(await schema.isValid({
        name: req.body.name,
        description: req.body.description,
        discount: req.body.discount,
        expireDate: req.body.expireDate,
      }))
    ) {
      return res.status(400).json({ error: Error.validation_failed });
    }


    const { id, name, expireDate } = await Coupon.create({
      name: req.body.name,
      description: req.body.description,
      discount: req.body.discount,
      expireDate: req.body.expireDate,
    });

    return res.json({ id, name, expireDate });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      description: Yup.string().required(),
      discount: Yup.string().required(),
      expireDate: yup.date().required()
    });

    if (
      !(await schema.isValid({
        name: req.body.name,
        description: req.body.description,
        discount: req.body.discount,
        expireDate: req.body.expireDate,
      }))
    ) {
      return res.status(400).json({ error: Error.validation_failed });
    }

    const { name, description, discount, expireDate } = req.body;

    const coupon = await Coupon.findOne({ where: { name } });

    const { id, name } = await coupon.update(req.body);

    return res.json({ id, name, email, cnpj });
  }
}

export default new CouponController();
