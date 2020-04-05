import Shop from '../models/Shop';

class QrController {
  async index(req, res) {
    const shops = await Shop.findAll(
      { attributes: ['id', 'retail_id', 'name', 'short_url'] },
      { where: { retail_id: req.body.retail_id } }
      );
      // .map(el => el.get({ plain: true }))
      // .filter(s => s.retail_id === req.body.retail_id);

      // console.log(shops);
      if (shops !== null) return res.json(shops);
    // if (fbs) {
    //   return res.json(fbs);
    // }
    return res.json({ error: 'Shop not found' });
  }
}
export default new QrController();
