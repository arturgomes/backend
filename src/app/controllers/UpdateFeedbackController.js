import * as Yup from 'yup';
import Valid from 'validator';
import Error from '../errors/errors.js';
import Feedback from '../models/Feedback.js';

class UpdateFeedbackController {
  async store(req, res) {
    const { user_id, tmp_feedback } = req.body;
    console.log({ user_id, tmp_feedback });
    if (tmp_feedback && Valid.isUUID(tmp_feedback)) {
      await Feedback.findOne({
        id: tmp_feedback,
      })
        .then(feed => {
          if (feed.user_id) {
            return res
              .status(400)
              .json({ error: Error.feedback_already_stored });
          }
          feed.update({
            user_id: user_id,
          });
          return res.json({ message: 'OK' });
        })
        .catch(() => { });


    }
    return res.status(400).json({ error: "Unable to assign feedback" })
  }


}

export default new UpdateFeedbackController();
