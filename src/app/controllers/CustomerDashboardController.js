import { Op, Sequelize } from 'sequelize'; //e aqui tbm
import Feedback from '../models/Feedback.js';
import Shop from '../models/Shop.js';
import Retail from '../models/Retail.js';
import User from '../models/User.js';
import Coupon from '../models/Coupon.js';

class CustomerDashboardController {
  async index(req, res) {
    const { user_id } = req.body;

    //retrieve all feedbacks from that user_id
    const feedbacks = await Feedback.findAll({
      group: ['Feedback.retail_id', 'Retail.id'],
      where: { user_id },
      attributes: [
        'retail_id',
        [Sequelize.fn('count', Sequelize.col('retail_id')), 'feedbacks_count'],
      ],
      include: [{ attributes: [['name', 'retail_name']], model: Retail }],
    });

    // console.log(feedbacks);
    //count all feedbacks
    const total_feedbacks = await Feedback.count({ where: { user_id } });

    //make a list of retail_ids form the feedback list
    const retail_ids = feedbacks.map((f) => f.retail_id);

    //get all the coupons available from the retail_ids list
    const loyalties = await Coupon.findAll({
      attributes: ['feedcoins', 'name', 'description', 'discount', 'retail_id'],
      where: {
        retail_id: {
          [Op.in]: retail_ids,
        },
      },
      include: [{ attributes: [['name', 'retail_name']], model: Retail }],
    });
    // console.log("loyalty_set: ",loyalties)

    // get the last feedback
    const last_feedback = await Feedback.findOne({
      where: {
        user_id,
      },
      order: [['createdAt', 'DESC']],
    });

    //get all the user data
    const user = await User.findByPk(user_id);

    return res.json({
      user,
      last_feedback,
      total_feedbacks,
      fb: feedbacks,
      loyalties,
    });

    // return res.json(feedbacks);
  }
}

export default new CustomerDashboardController();
