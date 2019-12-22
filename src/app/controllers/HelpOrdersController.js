import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrders';

class HelpOrders {
  async index(req, res) {
    const helpOrder = await HelpOrder.findAll({
      where: { student_id: req.student_id },
      order: [['created_at', 'DESC']],
      attributes: ['id', 'question', 'answer', 'answer_at'],
    });

    return res.json(helpOrder);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation faiils' });
    }

    const { question } = req.body;

    const { createdAt } = await HelpOrder.create({
      student_id: req.student_id,
      question,
    });

    return res.json({
      student_id: req.student_id,
      question,
      createdAt,
    });
  }
}

export default new HelpOrders();
