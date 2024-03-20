'use strict';
const job_data = require('../seed-files/demo-jobs.seed.ts');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('jobs', job_data);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('jobs', null, {});
  }
};
