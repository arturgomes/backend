"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _datefns = require('date-fns');
var _pt = require('date-fns/locale/pt'); var _pt2 = _interopRequireDefault(_pt);
var _Mail = require('../../lib/Mail'); var _Mail2 = _interopRequireDefault(_Mail);

class CancellationMail {
  // CancelationMail.key
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { appointment } = data;

    await _Mail2.default.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento Cancelado',
      template: 'cancelation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: _datefns.format.call(void 0, 
          _datefns.parseISO.call(void 0, appointment.date),
          "'dia' dd 'de' MMMM', às ' H:mm'h'",
          {
            locale: _pt2.default,
          }
        ),
      },
    });
  }
}

exports. default = new CancellationMail();
