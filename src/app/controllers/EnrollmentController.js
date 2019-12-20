import * as Yup from 'yup';
import { startOfDay, parseISO, isBefore } from 'date-fns';
import Enrollment from '../models/Enrollment';
import Plans from '../models/Plans';
import Students from '../models/Students';
import WelcomeMail from '../jobs/WelcomeMail';
import Queue from '../../lib/Queue';

class EnrollmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const enrollment = await Enrollment.findAll({
      order: [['created_at', 'DESC']],
      attributes: ['id', 'start_date', 'end_date', 'price'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Students,
          as: 'student',
          attributes: ['name', 'email'],
        },
        {
          model: Plans,
          as: 'plan',
          attributes: ['title', 'duration', 'price'],
        },
      ],
    });

    return res.json(enrollment);
  }

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
    const { name, email } = student;

    const plan = await Plans.findByPk(req.params.plan_id);
    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exists' });
    }
    const { title, duration, price: pricePlan } = plan;

    const date = parseISO(req.body.start_date);
    if (isBefore(date, startOfDay(new Date()))) {
      return res.status(400).json({ error: 'Past dates are not permited' });
    }

    const { price, end_date } = await Enrollment.create({
      student_id: student.id,
      plan_id: plan.id,
      start_date: date,
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

  async update(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date(),
      student_id: Yup.number()
        .integer()
        .positive(),
      plan_id: Yup.number()
        .integer()
        .positive(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    if (req.body.start_date) {
      const verifyDate = parseISO(req.body.start_date);
      if (isBefore(verifyDate, startOfDay(new Date()))) {
        return res.status(400).json({ error: 'Past dates are not permited' });
      }
    }

    if (req.body.student_id) {
      const verifyStudent = await Students.findByPk(req.body.student_id);
      if (!verifyStudent) {
        return res
          .status(400)
          .json({ error: 'Requested Student does not existis' });
      }
    }

    if (req.body.plan_id) {
      const verifyPlan = await Plans.findByPk(req.body.plan_id);
      if (!verifyPlan) {
        return res
          .status(400)
          .json({ error: 'Requested Plan does not existis' });
      }
    }

    const enrollment = await Enrollment.findByPk(req.params.id);
    if (!enrollment) {
      res.status(400).json({ error: 'Enrollment does not exists' });
    }

    const {
      start_date,
      end_date,
      price,
      student_id,
      plan_id,
    } = await enrollment.update(req.body);

    const { name, email } = await Students.findByPk(student_id);
    const { title, duration, price: pricePlan } = await Plans.findByPk(plan_id);

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
      start_date,
      end_date,
      price,
    });
  }

  async delete(req, res) {
    const enrollment = await Enrollment.findByPk(req.params.id);

    if (!enrollment) {
      return res.status(401).json({ error: 'The Enrollment does not exists' });
    }

    await enrollment.destroy();

    return res.json({
      sucess: `The Enrollment was deleted`,
    });
  }
}

export default new EnrollmentController();
