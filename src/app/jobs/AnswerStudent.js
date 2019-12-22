import Mail from '../../lib/Mail';

class AnswerStudent {
  get key() {
    return 'AnswerStudent';
  }

  async handle({ data }) {
    const { student, question, answer } = data;
    const { name, email } = student;

    await Mail.sendMail({
      to: `${name} <${email}>`,
      subject: 'Resposta a sua pergunta ao Gympoint !',
      template: 'answer',
      attachments: [
        {
          filename: 'logo.png',
          path: `${__dirname}/../views/image/logo.png`,
          cid: 'logo',
        },
      ],
      context: {
        student: name,
        question,
        answer,
      },
    });
  }
}

export default new AnswerStudent();
