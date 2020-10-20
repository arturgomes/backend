import { Op, Sequelize } from 'sequelize'; //e aqui tbm
import Feedback from '../models/Feedback.js';
import Shop from '../models/Shop.js';
import Retail from '../models/Retail.js';
import User from '../models/User.js';
import Coupon from '../models/Coupon.js';

class CustomerDashboardController {
  async index(req, res) {
    const { user_id } = req.body;
    let feedbacksX;
    Promise.all([
      //retrieve all feedbacks from that user_id
      Feedback.findAll({
        group: ['Feedback.retail_id', 'Retail.id'],
        where: { user_id },
        attributes: [
          'retail_id',
          [
            Sequelize.fn('count', Sequelize.col('retail_id')),
            'feedbacks_count',
          ],
        ],
        include: [{ attributes: [['name', 'retail_name']], model: Retail }],
      }),
    ]).then(([feedbacks]) => {
      const retail_ids = feedbacks.map((f) => f.retail_id);
      feedbacksX = feedbacks;
      Promise.all([
        Feedback.count({ where: { user_id } }),
        //get all the coupons available from the retail_ids list
        Coupon.findAll({
          attributes: [
            'feedcoins',
            'name',
            'description',
            'discount',
            'retail_id',
          ],
          where: {
            retail_id: {
              [Op.in]: retail_ids,
            },
          },
          include: [{ attributes: [['name', 'retail_name']], model: Retail }],
        }),
        // get the last feedback
        Feedback.findOne({
          where: {
            user_id,
          },
          order: [['createdAt', 'DESC']],
        }),
        //get all the user data
        User.findByPk(user_id),
      ])
        .then(([total_feedbacks, loyalties, last_feedback]) => {
          // console.log(feedbacks);

          //make a list of retail_ids form the feedback list

          // console.log("loyalty_set: ",loyalties)
          console.log({
            user,
            last_feedback,
            total_feedbacks,
            fb: feedbacksX,
            loyalties,
          });
          return res.json({
            user,
            last_feedback,
            total_feedbacks,
            fb: feedbacksX,
            loyalties,
          });
        })
        .catch((err) => res.json({ erro: err }));
      // return res.json(feedbacks);
    });
  }
}

export default new CustomerDashboardController();
