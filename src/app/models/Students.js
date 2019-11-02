import Sequelize, { Model } from 'sequelize';
import Moment from 'moment';

class Students extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        dateage: Sequelize.DATE,
        age: Sequelize.VIRTUAL,
        weight: Sequelize.FLOAT,
        height: Sequelize.FLOAT,
      },
      {
        sequelize,
      }
    );
  }

  checkAge() {
    Moment.locale('pt-br');
    const today = Moment(new Date());
    return Moment.duration(today.diff(this.dateage)).asYears();
  }
}

export default Students;
