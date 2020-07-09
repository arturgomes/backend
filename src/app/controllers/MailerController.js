import Shop from '../models/Shop';

import creds from "../../config/mail"
var router = express.Router();
var nodemailer = require('nodemailer');
const creds = require('./config');

var transport = {
    host: creds.host, // Don’t forget to replace with the SMTP host of your provider
    port: creds.port,
    auth: creds.auth
}

var transporter = nodemailer.createTransport(creds)

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages');
  }
});

router.post('/send', (req, res, next) => )


class MailerController {
  async index(req, res) {
    var name = req.body.name
    var email = req.body.email
    var message = req.body.message
    var content = `name: ${name} \n email: ${email} \n message: ${message} `

    var mail = {
      from: name,
      to: 'RECEIVING_EMAIL_ADDRESS_GOES_HERE',  // Change to email address that you want to receive messages on
      subject: 'New Message from Contact Form',
      text: content
    }

    transporter.sendMail(mail, (err, data) => {
      if (err) {
        res.json({
          status: 'fail'
        })
      } else {
        res.json({
         status: 'success'
        })
      }
    })
  }
}
export default new MailerController();
