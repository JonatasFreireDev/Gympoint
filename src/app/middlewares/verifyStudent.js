import * as Yup from 'yup';
import Student from '../models/Students';

export default async (req, res, next) => {
  const schema = Yup.object().shape({
    student_id: Yup.number()
      .integer()
      .positive()
      .required(),
  });

  if (!(await schema.isValid(req.params))) {
    return res.status(400).json({ error: 'Validation fails' });
  }

  const student = await Student.findByPk(req.params.student_id);
  if (!student) {
    return res.status(400).json({ error: 'Student does not exists' });
  }

  req.student_id = student.dataValues.id;

  return next();
};
