"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); //e aqui tbm
var _Feedback = require('../models/Feedback'); var _Feedback2 = _interopRequireDefault(_Feedback);
var _Shop = require('../models/Shop'); var _Shop2 = _interopRequireDefault(_Shop);
var _Retail = require('../models/Retail'); var _Retail2 = _interopRequireDefault(_Retail);
var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);
var _Coupon = require('../models/Coupon'); var _Coupon2 = _interopRequireDefault(_Coupon);


class CustomerDashboardController {

  async index(req, res) {
    const { user_id } = req.body;

    //retrieve all feedbacks from that user_id
    const feedbacks = await _Feedback2.default.findAll({
      group: ['Feedback.retail_id', 'Retail.id'],
      where: { user_id },
      attributes: ['retail_id', [_sequelize.Sequelize.fn('count', _sequelize.Sequelize.col('retail_id')), 'feedbacks_count']],
      include: [{ attributes: [['name', 'retail_name']], model: _Retail2.default }],
    })

    // console.log(feedbacks);
    //count all feedbacks
    const total_feedbacks = await _Feedback2.default.count({ where: { user_id } });

    //make a list of retail_ids form the feedback list
    const retail_ids = feedbacks.map(f => f.retail_id)

    //get all the coupons available from the retail_ids list
    const loyalties = await _Coupon2.default.findAll({
      attributes: ['feedcoins', 'name', 'description','discount','retail_id',],
      where: {
        retail_id: {
          [_sequelize.Op.in]: retail_ids
        }
      },
      include: [{ attributes: [['name', 'retail_name']], model: _Retail2.default }],

    });
    // console.log("loyalty_set: ",loyalties)


    // get the last feedback
    const last_feedback = await _Feedback2.default.findOne({
      where: {
        user_id,
      },
      order: [['createdAt', 'DESC']],
    });

    //get all the user data
    const user = await _User2.default.findByPk(user_id);

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

exports. default = new CustomerDashboardController();
