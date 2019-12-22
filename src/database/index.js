import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import User from '../app/models/User';
import Students from '../app/models/Students';
import Plans from '../app/models/Plans';
import Enrollment from '../app/models/Enrollment';

import databaseConfig from '../config/database';

const models = [User, Students, Plans, Enrollment];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));
    models.map(
      model => model.associate && model.associate(this.connection.models)
    );
  }

  mongo(){
    this.mongoConnection = mongoose.connect('mongodb://localhost:27017/gymmongo',{
      useNewUrlParser: true,
      useFindAndModify:true,
      useUnifiedTopology: true
    })
  }
}

export default new Database();
