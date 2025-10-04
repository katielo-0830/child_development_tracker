import { fileURLToPath } from 'url';
import path from 'path';
import Sequelize from 'sequelize';
import configFile from '../config/config.js';

// Import model definitions
import programModel from './program.js';
import sessionModel from './session.js';
import sessionTherapistModel from './sessiontherapist.js';
import stoModel from './sto.js';
import therapistModel from './therapist.js';
import trailModel from './trail.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const env = process.env.NODE_ENV || 'development';
const config = configFile[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Initialize models
const models = [
  programModel,
  sessionModel,
  sessionTherapistModel,
  stoModel,
  therapistModel,
  trailModel
];

models.forEach(modelDefiner => {
  const model = modelDefiner(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
});

// Run associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
