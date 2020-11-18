// import * as Yup from 'yup';
import Valid from 'validator';
import Error from '../errors/errors.js';
import Feedback from '../models/Feedback.js';

class UpdateFeedbackController {
  async store(req, res) {
    const { user_id, tmp_feedback } = req.body;
    // console.log({ user_id, tmp_feedback });
    const old_feedback = await Feedback.FindOne({ where: { user_id } });
    if (tmp_feedback && Valid.isUUID(tmp_feedback)) {
      await Feedback.findOne({
        id: tmp_feedback,
      })
        .then(feed => {
          console.log(feed);
          if (feed.user_id) {
            return res.status(400).json({ error: Error.feedback_already_stored });
          }
          const d1 = old_feedback.createdAt.getTime();
          const d2 = new Date().getTime();
          const diff = d2 - d1;
          const hours = diff / 1000 * 60 * 60;
          if (hours >= 24) {
            feed.update({ user_id: user_id });
            return res.status(200).json({ message: 'OK' });
          }
          return res.status(200).json({ message: 'Feedback já realizado nas ultimas 24h' });

        })
        .catch((e) => { console.log(e) });


    }
    return res.status(400).json({ error: "Unable to assign feedback" })
  }


}

export default new UpdateFeedbackController();
