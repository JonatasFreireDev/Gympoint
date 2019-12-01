import * as Yup from 'yup';
import Plans from '../models/Plans';

class PlansController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const plans = await Plans.findAll({
      attributes: ['id', 'title', 'duration', 'price'],
      order: [['updated_at', 'DESC']],
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.json(plans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .positive()
        .required(),
      price: Yup.number()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { title } = req.body;

    const plan = await Plans.findOne({ where: { title } });

    if (plan) {
      return res.status(401).json({ error: 'Plan already exists' });
    }

    const { duration, price } = await Plans.create(req.body);

    return res.json({
      plan: { title, duration, price },
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number().positive(),
      price: Yup.number().positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const plan = await Plans.findByPk(req.params.id);

    if (!plan) {
      return res.status(400).json({ error: 'The Plan does not exists' });
    }

    const { id, title, duration, price } = await plan.update(req.body);

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async delete(req, res) {
    const plan = await Plans.findByPk(req.params.id);

    if (!plan) {
      return res.status(401).json({ error: 'The Plan does not exists' });
    }

    await plan.destroy();

    return res.json({
      sucess: `The plan ${plan.title}, id: ${plan.id} was deleted`,
    });
  }
}

export default new PlansController();
