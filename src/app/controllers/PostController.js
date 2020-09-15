import * as Yup from 'yup';
import Posts from '../models/Posts';
import Error from '../errors/errors';

class PostsController {
  async index(req, res) {
    const { posts_id } = req.params;
    const posts = await Posts.findByPk({ posts_id })
    return res.json(posts);
  }

  async store(req, res) {
    console.log("posting to db")
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      author: Yup.string().required(),
      content: Yup.string().required(),
    });

    if (
      !(await schema.isValid({
        title: req.body.title,
        author: req.body.author,
        content: req.body.content,
      }))
    ) {
      return res.status(400).json({ error: Error.validation_failed });
    }

    const { id, title, author, content } = await Posts.create({
      title: req.body.title,
        author: req.body.author,
        content: req.body.content,
    });

    return res.json({ id, title, author, content  });
  }

  // async update(req, res) {

  // }
}

export default new PostsController();
