// import * as Yup from 'yup';
import Feedback from '../models/Feedback';
import Shop from '../models/Shop';

// import Error from '../errors/errors';
// essa porra de display tá dando nos nervos, depois eu continuo
class DisplayFeedbackController {
  async index(req, res) {
    const shops = await Shop.findAll(
      { attributes: ['id', 'retail_id', 'name'] },
      { where: { retail_id: req.body.retail_id } }
    )
      .map(el => el.get({ plain: true }))
      .filter(s => s.retail_id === req.body.retail_id);
    // console.log(shops);

    const fb = await Promise.all(
      shops.map(async s => {
        const { id } = s;
        // console.log(id);
        const f = await Feedback.findAll(
          {
            attributes: ['date', 'shop_id', 'nps_value', 'comment_optional'],
          },
          { where: { shop_id: id } }
        )
          .map(el => el.get({ plain: true }))
          .filter(s => s.shop_id === id);
        // console.log(f);

        return { shop_name: s.name, f };
      })
    );
    console.log(fb);

    if (fb !== null) return res.json(fb);
    // if (fbs) {
    //   return res.json(fbs);
    // }
    return res.json({ error: 'Shop not found' });
  }
}

export default new DisplayFeedbackController();
