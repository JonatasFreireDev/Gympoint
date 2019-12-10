import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class WelcomeMail {
  get key() {
    return 'WelcomeMail';
  }

  async handle({ data }) {
    const { student, title, duration, price, end_date } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Bem vindo ao Gympoint !',
      template: 'wellcome',
      attachments: [
        {
          filename: 'logo.png',
          path: `${__dirname}/../views/image/logo.png`,
          cid: 'logo',
        },
      ],
      context: {
        student: student.name,
        plan: title,
        duration,
        price,
        date: format(parseISO(end_date), 'dd/MM/yyyy', {
          locale: pt,
        }),
      },
    });
  }
}

export default new WelcomeMail();
