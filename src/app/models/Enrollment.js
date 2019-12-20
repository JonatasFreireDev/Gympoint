import Sequelize, { Model } from 'sequelize';
import { addMonths, isBefore, startOfDay } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Plan from './Plans';

class Enrollment extends Model {
  static init(sequelize) {
    super.init(
      {
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        price: Sequelize.DOUBLE,
      },
      {
        // modelName: 'enrollment',
        tableName: 'enrollment',
        freezeTableName: true,
        sequelize,
      }
    );

    this.addHook('beforeSave', async enrollment => {
      const { plan_id } = enrollment.dataValues;

      const plan = await Plan.findByPk(plan_id);
      if (plan) {
        if (isBefore(enrollment.start_date, startOfDay(new Date()))) {
          enrollment.start_date = new Date();
        }
        enrollment.end_date = addMonths(enrollment.start_date, plan.duration, {
          locale: pt,
        });
        enrollment.price = plan.duration * plan.price;
      }
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Students, {
      foreignKey: 'student_id',
      as: 'student',
    });
    this.belongsTo(models.Plans, {
      foreignKey: 'plan_id',
      as: 'plan',
    });
  }
}

export default Enrollment;
