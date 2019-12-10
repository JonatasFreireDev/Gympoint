import * as Yup from 'yup';
import { startOfDay, parseISO, isBefore, addMonths } from 'date-fns';
import Enrollment from '../models/Enrollment';
import Plans from '../models/Plans';
import Students from '../models/Students';
import WelcomeMail from '../jobs/WelcomeMail';
import Queue from '../../lib/Queue';

class EnrollmentController {
  // async index(req, res) {}

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .integer()
        .positive()
        .required(),
      plan_id: Yup.number()
        .integer()
        .positive()
        .required(),
      start_date: Yup.date().required(),
    });

    if (
      !(await schema.isValid({
        student_id: req.params.student_id,
        plan_id: req.params.plan_id,
        start_date: req.body.start_date,
      }))
    ) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const student = await Students.findByPk(req.params.student_id);
    if (!student) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    const plan = await Plans.findByPk(req.params.plan_id);
    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exists' });
    }

    const date = parseISO(req.body.start_date);

    if (isBefore(date, startOfDay(new Date()))) {
      return res.status(400).json({ error: 'Past dates are not permited' });
    }

    const { title, duration, price: pricePlan } = plan;
    const { name, email } = student;

    const end_date = addMonths(date, duration);
    const price = duration * pricePlan;

    await Enrollment.create({
      student_id: student.id,
      plan_id: plan.id,
      start_date: date,
      end_date,
      price,
    });

    await Queue.add(WelcomeMail.key, {
      student,
      title,
      duration,
      price,
      end_date,
    });

    return res.json({
      student: {
        name,
        email,
      },
      plan: {
        title,
        duration,
        price: pricePlan,
      },
      start_date: date,
      end_date,
      price,
    });
  }

  // async update(req, res) {}

  // async delete(req, res) {}
}

export default new EnrollmentController();
