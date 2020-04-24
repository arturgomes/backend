import Sequelize from 'sequelize'; //e aqui tbm
import Feedback from '../models/Feedback';
import Shop from '../models/Shop';
import Retail from '../models/Retail';


function filterNPSResults(fb) {
  console.log("linha 8");
  let media = fb.map(f => { return parseInt(f.nps_value) });
  var total = media.reduce((result, number) => result + number);
  let nf = fb.filter(f => f.nps_value < 7);
  let ne = fb.filter(f => f.nps_value >= 7 && f.nps_value < 9);
  let po = fb.filter(f => f.nps_value >= 9);
  const negf = nf.length;
  console.log("linha 15");
  console.log(nf, po, ne)
  return {
    posFeedbacks: po.length,
    negFeedbacks: negf,
    neutralFeedbacks: ne.length,
    totalFeedbacks: fb.length,
    average: (total / fb.length),
  };
}
function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}

function _listItems(fb) {
  let listShops;
  // const fb1 = fb.flat(1);
  const tmp = Object.keys(fb).map(key => {
    const shop = fb[key];
    const { f } = shop;
    listShops = Object.keys(f).map(g => {
      const { nps_value, date } = f[g];
      let date1 = new Date(date).toLocaleDateString("pt-BR");
      return { nps_value, date1 };
    });
    return listShops;
  })
  return flatten(tmp);
}


class DashboardController {

  async index(req, res) {

    const fb = await Feedback.findAll({
      attributes: ['created_at', 'nps_value', 'shop_id','retail_id'],
      where: {
        retail_id: req.body.retail_id
      }
    });

    console.log("linha 66: index dashboard, fb: ", fb);

    // const fb = await Feedback.findAll(
    //       {
    //         include: [{model: models.Shop, as: 'retail_id'}],
    //         // include: [{
    //         //   model: Shop,
    //         //   required: true,
    //         //   include:[{
    //         //     model: Retail,
    //         //     required: true
    //         //    }]
    //         //  }],
    //         attributes: ['created_at', 'nps_value', 'shop_id' ,'retail_id'
    //       ],
    //       },
    //       // { where: { retail_id: req.body.retail_id } }
    //     );
    //       // .filter(s => s.shop_id === id);

    // console.log("imprimindo fb: ", fb[0]);
    if (!fb) {
      return res.json({
        posFeedbacks: 0,
        negFeedbacks: 0,
        neutralFeedbacks: 0,
        totalFeedbacks: 0,
        average: 0,
        dados: []

      });
    }
    console.log("linha 90: index dashboard, retail_id: ", req.body.retail_id);


    const now = new Date();
    var oneYearAgo = new Date();
    var sixMonthsAgo = new Date();
    var aMonthsAgo = new Date();
    sixMonthsAgo.setFullYear(sixMonthsAgo.getFullYear(), sixMonthsAgo.getMonth() - 6);
    aMonthsAgo.setFullYear(aMonthsAgo.getFullYear(), aMonthsAgo.getMonth() - 1);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    // const Op = Sequelize.Op //incluí isso pela internet


    //  const mes = await Feedback.findAll(
    //         {
    //           where: { retail_id: req.body.retail_id,
    //                     created_at: {[Op.between]: [ oneYearAgo,now]}
    //                   },
    //           include: [{
    //                     model: Shop,
    //                     attributes: [['id','shops']],
    //                     as: 'shops'
    //                   },
    //                 ],
    //           attributes: [
    //                       // 'created_at',
    //                       [ Sequelize.fn('date_trunc', 'month', Sequelize.col('feedbacks.updated_at')), 'dt'],
    //                       [ Sequelize.fn('count', '*'), 'count']
    //                   ],
    //           order: [[Sequelize.fn('date_trunc', 'month', Sequelize.col('feedbacks.updated_at'))]],
    //           group: 'dt',
    //           }
    //         ) ;
    //   const dia = await Feedback.findAll(
    //           {
    //           attributes: [//'shop_id',
    //                       [ Sequelize.fn('date_trunc', 'day', Sequelize.col('feedbacks.updated_at')), 'dt'],
    //                       [Sequelize.literal(`COUNT(*)`), 'count']
    //                       ],
    //            where: { retail_id: req.body.retail_id,
    //                     created_at: {[Op.between]: [ aMonthsAgo,now]}
    //                   },
    //           include: [{
    //                     model: Shop,
    //                     attributes: [['id','shops']],
    //                     as: 'shops'
    //                   },
    //                 ],
    //           order: [[Sequelize.fn('date_trunc', 'day', Sequelize.col('feedbacks.updated_at'))]],
    //           group: ['dt'],
    //           // sort: ['dia', descending]

    //           }
    //         );
    //   const semana = await Feedback.findAll(
    //           {
    //           attributes: [//'shop_id',
    //             [Sequelize.literal(`COUNT(*)`), 'count'],
    //             [ Sequelize.fn('date_trunc', 'week', Sequelize.col('feedbacks.updated_at')), 'dt'],
    //                       ],
    //            where: { retail_id: req.body.retail_id,
    //                     created_at: {[Op.between]: [ sixMonthsAgo,now]}
    //                   } ,
    //           include: [{
    //                     model: Shop,
    //                     attributes: [['id','shops']],
    //                     as: 'shops'
    //                   },
    //                 ],
    //           order: [[Sequelize.fn('date_trunc', 'week', Sequelize.col('feedbacks.updated_at'))]],
    //           group: ['dt'],
    //           }
    //         );



    const {
      posFeedbacks,
      negFeedbacks,
      neutralFeedbacks,
      totalFeedbacks,
      average
    } = filterNPSResults(fb);
    console.log("linha 93: index dashboard, retail_id: ", {
      posFeedbacks,
      negFeedbacks,
      neutralFeedbacks,
      totalFeedbacks,
      average
    });


    if (fb) {
      return res.json({
        posFeedbacks,
        negFeedbacks,
        neutralFeedbacks,
        totalFeedbacks,
        average,
        dados: fb

      });
    }
    return res.json({ error: 'Shop not found' });
  }





  // async index(req, res) {
  //   // console.log("req.body.retail_id: ", req.body.retail_id)
  //   const shops = await Shop.findAll(
  //     { attributes: ['id'] },
  //     { where: { retail_id: req.body.retail_id } }
  //   )
  //     .map(el => el.get({ plain: true }));
  //   // .filter(s => s.retail_id === req.body.retail_id);
  //   // console.log("Shops: ", shops)
  //   const fb = await Promise.all(
  //     shops.map(async s => {
  //       const { id } = s;
  //       const f = await Feedback.findAll(
  //         {
  //           attributes: ['created_at', 'nps_value', 'shop_id'],
  //         },
  //         { where: { shop_id: id } }
  //       )
  //         .filter(s => s.shop_id === id);

  //       return { f };

  //     })
  //   );
  //   const now = new Date();
  //   var oneYearAgo = new Date();
  //   var sixMonthsAgo = new Date();
  //   var aMonthsAgo = new Date();
  //   sixMonthsAgo.setFullYear(sixMonthsAgo.getFullYear(), sixMonthsAgo.getMonth() - 6);
  //   aMonthsAgo.setFullYear(aMonthsAgo.getFullYear(), aMonthsAgo.getMonth() -1);
  //   oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  //   const Op = Sequelize.Op //incluí isso pela internet

  //   const fc = await Promise.all(
  //     shops.map(async s => {
  //       const { id } = s;
  //       const mes = await Feedback.findAll(
  //         {
  //           where: { shop_id: id,
  //                     created_at: {[Op.between]: [ oneYearAgo,now]}
  //                   },
  //           attributes: [
  //                       // 'created_at',
  //                       [ Sequelize.fn('date_trunc', 'month', Sequelize.col('updated_at')), 'dt'],
  //                       [ Sequelize.fn('count', '*'), 'count']
  //                   ],
  //           order: [[Sequelize.fn('date_trunc', 'month', Sequelize.col('updated_at'))]],
  //           group: 'dt',
  //           }
  //         ) ;
  //       const dia = await Feedback.findAll(
  //           {
  //           attributes: [//'shop_id',
  //                       [ Sequelize.fn('date_trunc', 'day', Sequelize.col('updated_at')), 'dt'],
  //                       [Sequelize.literal(`COUNT(*)`), 'count']
  //                       ],
  //            where: { shop_id: id,
  //                     created_at: {[Op.between]: [ aMonthsAgo,now]}
  //                   },
  //           order: [[Sequelize.fn('date_trunc', 'day', Sequelize.col('updated_at'))]],
  //           group: ['dt'],
  //           // sort: ['dia', descending]

  //           }
  //         );
  //       const semana = await Feedback.findAll(
  //           {
  //           attributes: [//'shop_id',
  //             [Sequelize.literal(`COUNT(*)`), 'count'],
  //             [ Sequelize.fn('date_trunc', 'week', Sequelize.col('updated_at')), 'dt'],
  //                       ],
  //            where: { shop_id: id,
  //                     created_at: {[Op.between]: [ sixMonthsAgo,now]}
  //                   },
  //           order: [[Sequelize.fn('date_trunc', 'week', Sequelize.col('updated_at'))]],
  //           group: ['dt'],
  //           }
  //         );


  //       return {id,mes,semana,dia} ;

  //     })
  //   );

  //   const {
  //     posFeedbacks,
  //     negFeedbacks,
  //     neutralFeedbacks,
  //     totalFeedbacks,
  //     average
  //   } = filterNPSResults(fb);


  //   if (fb) {
  //     return res.json({
  //       posFeedbacks,
  //       negFeedbacks,
  //       neutralFeedbacks,
  //       totalFeedbacks,
  //       average,
  //       dados:fc

  //     });
  //   }
  //   return res.json({ error: 'Shop not found' });
  // }
}

export default new DashboardController();
