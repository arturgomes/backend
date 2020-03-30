import * as Yup from 'yup';
import Retail from '../models/Retail';
import Error from '../errors/errors';

class RetailController {
  async index(req,res){
    const { retail_id } = req.params;
    const retail = await Retail.findByPk({retail_id})
    return res.json(retail);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
      // .min(6),
      cnpj: Yup.string().required(),
      phone: Yup.string().required(),
    });

    if (
      !(await schema.isValid({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        cnpj: req.body.cnpj,
        phone: req.body.phone,
      }))
    ) {
      return res.status(400).json({ error: Error.validation_failed });
    }

    const retailEx = await Retail.findOne({ where: { email: req.body.email } });
    // const userEx = await User.findOne({ where: { email: req.body.email } });

    if (retailEx) {
      return res.status(400).json({ error: Error.email_already_used });
    }

    const retailExists = await Retail.findOne({
      where: { cnpj: req.body.cnpj },
    });

    if (retailExists) {
      return res.status(400).json({ error: Error.shop_exists });
    }

    const { id, name, email, cnpj } = await Retail.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      cnpj: req.body.cnpj,
    });

    return res.json({ id, name, email, cnpj });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      cnpj: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: Error.validation_failed });
    }

    const { cnpj, email, oldPassword } = req.body;

    const retail = await Retail.findByPk(req.shopId);

    if (cnpj !== retail.cnpj) {
      const retailExists = await Retail.findOne({ where: { cnpj } });

      if (retailExists) {
        return res.status(400).json({ error: Error.shop_exists });
      }
    }

    if (oldPassword && !(await retail.checkPassword(oldPassword))) {
      return res.status(401).json({ error: Error.invalid_password });
    }

    const { id, name } = await retail.update(req.body);

    return res.json({ id, name, email, cnpj });
  }
}

export default new RetailController();
