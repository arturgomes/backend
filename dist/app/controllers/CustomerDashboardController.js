"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = require("sequelize");

var _Feedback = _interopRequireDefault(require("../models/Feedback"));

var _Shop = _interopRequireDefault(require("../models/Shop"));

var _Retail = _interopRequireDefault(require("../models/Retail"));

var _User = _interopRequireDefault(require("../models/User"));

var _Coupon = _interopRequireDefault(require("../models/Coupon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//e aqui tbm
class CustomerDashboardController {
  async index(req, res) {
    const {
      user_id
    } = req.body; //retrieve all feedbacks from that user_id

    const feedbacks = await _Feedback.default.findAll({
      group: ['Feedback.retail_id', 'Retail.id'],
      where: {
        user_id
      },
      attributes: ['retail_id', [_sequelize.Sequelize.fn('count', _sequelize.Sequelize.col('retail_id')), 'feedbacks_count']],
      include: [{
        attributes: [['name', 'retail_name']],
        model: _Retail.default
      }]
    }); // console.log(feedbacks);
    //count all feedbacks

    const total_feedbacks = await _Feedback.default.count({
      where: {
        user_id
      }
    }); //make a list of retail_ids form the feedback list

    const retail_ids = feedbacks.map(f => f.retail_id); //get all the coupons available from the retail_ids list

    const loyalties = await _Coupon.default.findAll({
      attributes: ['feedcoins', 'name', 'description', 'discount', 'retail_id'],
      where: {
        retail_id: {
          [_sequelize.Op.in]: retail_ids
        }
      },
      include: [{
        attributes: [['name', 'retail_name']],
        model: _Retail.default
      }]
    }); // console.log("loyalty_set: ",loyalties)
    // get the last feedback

    const last_feedback = await _Feedback.default.findOne({
      where: {
        user_id
      },
      order: [['createdAt', 'DESC']]
    }); //get all the user data

    const user = await _User.default.findByPk(user_id);
    return res.json({
      user,
      last_feedback,
      total_feedbacks,
      fb: feedbacks,
      loyalties
    }); // return res.json(feedbacks);
  }

}

var _default = new CustomerDashboardController();

exports.default = _default;