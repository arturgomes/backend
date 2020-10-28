import * as Yup from 'yup';
import Coupon from '../models/Coupon.js';
import Error from '../errors/errors.js';

class CouponController {
  async index(req, res) {
    const { retail_id } = req.params;
    await Coupon.findAll({ where: { retail_id } })
      // .filter(s => s.retail_id === req.params.retail_id);
      // console.log("Cupons: ",coupons)
      .then(coupons => {
        if (!coupons) {
          return res.status(400).json({ error: "no coupons found for this retail" });
        }
        return res.json(coupons);
      })
  }

  async store(req, res) {
    // console.log("req",req.body)
    // const schema = Yup.object().shape({
    //   name: Yup.string().required(),
    //   descricao: Yup.string().required(),
    //   discount: Yup.string().required(),
    //   expDate: Yup.string().required(),
    //   retail_id: Yup.string().required(),
    // });

    const validation = {
      retail_id: req.body.retail_id,
      name: req.body.name,
      feedcoins: req.body.feedcoins,
      description: req.body.descricao,
      loyalty: req.body.loyalty,
      discount: req.body.discount,
      expire_date: req.body.expDate,
    };

    // console.log("passou no schema", validation);
    // if (
    //   !(await schema.isValid(validation))
    // ) {
    //   console.log("error",Error.validation_failed);
    //   return res.status(400).json({ error: Error.validation_failed });
    // }

    // console.log("passou no yup");
    await Coupon.create(validation)
      .then(coupon => {
        console.log(coupon)
        if (!coupon) {
          return res.status(400).json({ error: "Cupom não criado" })
        }
        console.log("id: ", coupon);
        return res.json(coupon);

      })
      .catch(error => { console.log(error) });

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

    const { id, name: name_i } = await coupon.update(req.body);

    return res.json({ id, name_i, email, cnpj });
  }
  async delete(req,res){
    const { coupon_id } = req.body;
    console.log(coupon_id);

    const coupon = await Coupon.findByPk(coupon_id);
    console.log(coupon);
    await coupon.destroy();

    return res.status(200).json({
      message: 'Coupon deleted',
    });
  }
}

export default new CouponController();
