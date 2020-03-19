import Sequelize from 'sequelize'; //e aqui tbm
import sequelize from '../../database/' //tava tentando ver se isso influencia
import Feedback from '../models/Feedback';
import Shop from '../models/Shop';
import moment from "moment";


function filterNPSResults(fb) {

  var listItems = _listItems(fb);
  let media = listItems.map(f => { return parseInt(f.nps_value) });
  var total = media.reduce((result, number) => result + number);
  let nf = listItems.filter(f => f.nps_value < 7);
  let ne = listItems.filter(f => f.nps_value >= 7 && f.nps_value < 9);
  let po = listItems.filter(f => f.nps_value >= 9);
  const negf = nf.length;
  // console.log(po.length, negf, ne.length, listItems.length)
  return {
    posFeedbacks: po.length,
    negFeedbacks: negf,
    neutralFeedbacks: ne.length,
    totalFeedbacks: listItems.length,
    average: (total / media.length),
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

// async function filterFeedBy(shops) {

//       const fb = await Promise.all(
//         shops.map(async s => {
//           const { id } = s;
//           // console.log(id);
//           const f = await Feedback.findAll(
//             {
//               attributes: ['date', 'shop_id', 'nps_value', 'comment_optional',
//               [Sequelize.fn('DATE','created_at'), 'date'],
//               [sequelize.fn('COUNT', '*'), 'count']
//             ]
//             },
//             { where: { shop_id: id } }

//           )
//             .map(el => el.get({ plain: false }));
//           // console.log(f);

//           return { shop_name: s.name, f };
//         })
//       );
//       console.log(fb);

//     //   await Feedback.findAll({
//     //     where: {
//     //           shop_id: id,
//     //       //     date: {
//     //       //       $gte: moment().subtract(7, 'days').toDate()
//     //       //     }
//     //         },
//     //     attributes: [
//     //         [Sequelize.literal(`DATE("created_at")`), 'date'],
//     //         [Sequelize.literal(`COUNT(*)`), 'count']
//     //     ],
//     //     group: ['date'],
//     // })
//       // const { count } = await Feedback.findAndCountAll({
//       //   where: {
//       //     shop_id: id,
//       //     date: {
//       //       $gte: moment().subtract(7, 'days').toDate()
//       //     }
//       //   },
//       // });


//       console.log("count:", t1)

//       console.log("t1: ", t1,
//       t2,
//       t3)
//       const perweek = t1;
//       const permonth = t2;
//       const sixmonths = t3;
//       return fb;
//   return { perweek, permonth, sixmonths }



//   // var listItemsWeek = listItems.filter(function (date) { return date >= d });
// }

class DashboardController {

  async index(req, res) {
    // console.log("req.body.retail_id: ", req.body.retail_id)
    const shops = await Shop.findAll(
      { attributes: ['id'] },
      { where: { retail_id: req.body.retail_id } }
    )
      .map(el => el.get({ plain: true }));
    // .filter(s => s.retail_id === req.body.retail_id);
    // console.log("Shops: ", shops)
    const fb = await Promise.all(
      shops.map(async s => {
        const { id } = s;
        const f = await Feedback.findAll(
          {
            attributes: ['created_at', 'nps_value', 'shop_id'],
          },
          { where: { shop_id: id } }
        )
          .filter(s => s.shop_id === id);

        return { f };

      })
    );
    const now = new Date();
    var oneYearAgo = new Date();
    var sixMonthsAgo = new Date();
    var aMonthsAgo = new Date();
    sixMonthsAgo.setFullYear(sixMonthsAgo.getFullYear(), sixMonthsAgo.getMonth() - 6);
    aMonthsAgo.setFullYear(aMonthsAgo.getFullYear(), aMonthsAgo.getMonth() -1);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const Op = Sequelize.Op //incluí isso pela internet

    const fc = await Promise.all(
      shops.map(async s => {
        const { id } = s;
        const mes = await Feedback.findAll(
          {
            where: { shop_id: id,
                      created_at: {[Op.between]: [ oneYearAgo,now]}
                    },
            attributes: [
                        // 'created_at',
                        [ Sequelize.fn('date_trunc', 'month', Sequelize.col('updated_at')), 'dt'],
                        [ Sequelize.fn('count', '*'), 'count']
                    ],
            order: [[Sequelize.fn('date_trunc', 'month', Sequelize.col('updated_at'))]],
            group: 'dt',
            }
          ) ;
        const dia = await Feedback.findAll(
            {
            attributes: [//'shop_id',
                        [ Sequelize.fn('date_trunc', 'day', Sequelize.col('updated_at')), 'dt'],
                        [Sequelize.literal(`COUNT(*)`), 'count']
                        ],
             where: { shop_id: id,
                      created_at: {[Op.between]: [ aMonthsAgo,now]}
                    },
            order: [[Sequelize.fn('date_trunc', 'day', Sequelize.col('updated_at'))]],
            group: ['dt'],
            // sort: ['dia', descending]

            }
          );
        const semana = await Feedback.findAll(
            {
            attributes: [//'shop_id',
              [Sequelize.literal(`COUNT(*)`), 'count'],
              [ Sequelize.fn('date_trunc', 'week', Sequelize.col('updated_at')), 'dt'],
                        ],
             where: { shop_id: id,
                      created_at: {[Op.between]: [ sixMonthsAgo,now]}
                    },
            order: [[Sequelize.fn('date_trunc', 'week', Sequelize.col('updated_at'))]],
            group: ['dt'],
            }
          );


        return {id,mes,semana,dia} ;

      })
    );

    const {
      posFeedbacks,
      negFeedbacks,
      neutralFeedbacks,
      totalFeedbacks,
      average
    } = filterNPSResults(fb);


if (fb) {
    //   return res.json(fbs);
    return res.json({
      posFeedbacks,
      negFeedbacks,
      neutralFeedbacks,
      totalFeedbacks,
      average,
      dados:fc

    });
    }
    //
    return res.json({ error: 'Shop not found' });
  }
}

export default new DashboardController();
