import { subWeeks } from 'date-fns';
import Checkins from '../schemas/Checkins';

class CheckinsController {
  async index(req, res) {
    const { student_id } = req;

    const checkins = await Checkins.find({
      student_id,
    })
      .sort('-createdAt')
      .select('createdAt');

    return res.json(checkins);
  }

  async store(req, res) {
    const { student_id } = req;

    const userCheckins = await Checkins.find({ student_id });
    const today = new Date();
    const subwe = subWeeks(today, 1);

    let cont = 1;
    // eslint-disable-next-line consistent-return
    userCheckins.forEach(checkin => {
      if (checkin.createdAt >= subwe && checkin.createdAt <= today) {
        // eslint-disable-next-line no-plusplus
        cont++;
        if (cont === 6) {
          return false;
        }
      }
    });

    if (cont >= 6) {
      return res.status(400).json({
        error: 'You do the max of Checkins (5) in this last 7 days',
      });
    }

    const { createdAt: thisCheckin } = await Checkins.create({
      student_id,
    });

    return res.json({
      student_id,
      thisCheckin,
      cont,
    });
  }
}

export default new CheckinsController();
