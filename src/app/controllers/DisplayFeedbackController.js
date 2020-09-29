// import * as Yup from 'yup';
import Feedback from '../models/Feedback';
import Shop from '../models/Shop';

// import Error from '../errors/errors';
// essa porra de display tá dando nos nervos, depois eu continuo
class DisplayFeedbackController {
  async index(req, res) {
    console.log("entrou no controller", req.body.retail_id);
    // const shops = await Shop.findAll(
    //   { attributes: ['id', 'retail_id', 'name'] },
    //   { where: { retail_id: req.body.retail_id } }
    // )
    //
    // console.log(shops);
    let shopls;
    await Shop.findAll(
      { attributes: ['id', 'retail_id', 'name'] },
      { where: { retail_id: req.body.retail_id } }
    ).then(shops => {
      const list = shops.map(el => el.get({ plain: true }))
        .filter(s => s.retail_id === req.body.retail_id);
      console.log(list);
      if (list.length === 0) {
        res.json([])
      }
      shopls = list;

    })
      .catch(err => console.log(err))
    //   .map(el => el.get({ plain: true }))
    //   .filter(s => s.retail_id === req.body.retail_id);
    // console.log(shops);

    // const fb = await Promise.all(
    //   shops.map(async s => {
    //     const { id } = s;
    //     // console.log(id);
    //     const f = await Feedback.findAll(
    //       {
    //         attributes: ['date', 'shop_id', 'nps_value', 'comment_optional'],
    //       },
    //       { where: { shop_id: id } }
    //     )
    //       .map(el => el.get({ plain: true }))
    //       .filter(s => s.shop_id === id);
    //     // console.log(f);

    //     return { shop_name: s.name, f };
    //   })
    // );

    const functionWithPromise = id => { //a function that returns a promise
      Feedback.findAll(
        {
          attributes: ['date', 'shop_id', 'nps_value', 'comment_optional'],
        },
        { where: { shop_id: id } }
      ).then( fb => {
        const fbs = fb.map(el => el.get({ plain: true }))
        .filter(s => s.shop_id === id);
        console.log(fbs)
        return fbs
      }

      ).catch(err => console.log(err))
    }

    const anAsyncFunction = async item => {
      const {id } = item
      return functionWithPromise(id)
    }

    const getData = async (shops) => {
      return Promise.all(shops.map(item => anAsyncFunction(item)).flat())
    }

    getData(shopls).then(data => {
      // console.log(data)
      if (data !== null) return res.json(data);
    // if (fbs) {
    //   return res.json(fbs);
    // }
    return res.json({ error: 'Shop not found' });
    }).catch(err => console.log(err))
    // console.log(fb);
    console.log(fb);

    // if (fb !== null) return res.json(fb);
    // // if (fbs) {
    // //   return res.json(fbs);
    // // }
    // return res.json({ error: 'Shop not found' });
  }
}

export default new DisplayFeedbackController();
