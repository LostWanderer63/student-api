const { sequelize } = require('./models');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Sequelize connected to MySQL');
    await sequelize.sync();
    console.log('Tables synced: students, courses, enrollments');
  } catch (err) {
    console.error('Sequelize error:', err.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
})();
