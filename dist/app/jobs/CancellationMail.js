"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dateFns = require("date-fns");

var _pt = _interopRequireDefault(require("date-fns/locale/pt"));

var _Mail = _interopRequireDefault(require("../../lib/Mail"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class CancellationMail {
  // CancelationMail.key
  get key() {
    return 'CancellationMail';
  }

  async handle({
    data
  }) {
    const {
      appointment
    } = data;
    await _Mail.default.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento Cancelado',
      template: 'cancelation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: (0, _dateFns.format)((0, _dateFns.parseISO)(appointment.date), "'dia' dd 'de' MMMM', às ' H:mm'h'", {
          locale: _pt.default
        })
      }
    });
  }

}

var _default = new CancellationMail();

exports.default = _default;