import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrders';
import Students from '../models/Students';
import Queue from '../../lib/Queue';
import AnswerStudent from '../jobs/AnswerStudent';

class HelpOrdersUserController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const question = await HelpOrder.findAll({
      where: { answer: null },
      order: [['created_at', 'DESC']],
      attributes: ['id', 'question', 'answer', 'createdAt'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Students,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    return res.json(question);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      help_orders_id: Yup.number()
        .integer()
        .positive()
        .required(),
      answer: Yup.string().required(),
    });

    if (
      !(await schema.isValid({
        help_orders_id: req.params.help_orders_id,
        answer: req.body.answer,
      }))
    ) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const helpOrder = await HelpOrder.findOne({
      where: { id: req.params.help_orders_id },
      attributes: ['id', 'question', 'createdAt'],
      include: [
        {
          model: Students,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });
    if (!helpOrder) {
      return res.status(400).json({ error: 'Help Order does not exists' });
    }

    const answerUpdate = await helpOrder.update(req.body);

    const { student, question, answer } = answerUpdate;

    await Queue.add(AnswerStudent.key, {
      student,
      question,
      answer,
    });

    return res.json(answerUpdate);
  }
}

export default new HelpOrdersUserController();
