import * as Yup from 'yup';
import Students from '../models/Students';

class StudentsController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      dateage: Yup.string().required(),
      weight: Yup.number().positive(),
      height: Yup.number().positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const emailExists = await Students.findOne({
      where: { email: req.body.email },
    });

    if (emailExists) {
      return res.status(400).json({ error: 'user already exists.' });
    }

    const { id, name, email, dateage } = await Students.create(req.body);

    const user = await Students.findOne({ where: { email } });

    const age = Math.floor(user.checkAge());

    return res.json({
      id,
      name,
      email,
      dateage,
      age,
    });
  }

  // async update(req, res) {}
}

export default new StudentsController();
