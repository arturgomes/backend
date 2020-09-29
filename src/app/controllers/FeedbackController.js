// import * as Yup from 'yup';
import Feedback from '../models/Feedback.js';
import Shop from '../models/Shop.js';
// import User from '../models/User';
import questions from '../feedbacks/perguntas.js';
import Error from '../errors/errors.js';

class FeedbackController {
  async index(req, res) {
    const { shop_id } = req.params;

    const shop = await Shop.findOne({ where: { id: shop_id } });
    if (shop) {
      return res.json(questions(shop.name));
    }
    return res.json({ error: 'Shop not found' });
  }

  async store(req, res) {
    const { shop_id } = req.params;
    const { nps, com } = req.body.answers;

    const shop = await Shop.findByPk(shop_id);

    if (shop.id !== shop_id) {
      return res.status(401).json({ error: Error.invalid_shop });
    }

    const response = await Feedback.create({
      date: Date.now(),
      user_id: null, // userExists.id,
      shop_id: shop.id,
      nps_value: nps,
      retail_id:shop.retail_id,
      comment_optional: com,
    });
    const fid = response.id;
    return res.json({ fid });
  }
}

export default new FeedbackController();
