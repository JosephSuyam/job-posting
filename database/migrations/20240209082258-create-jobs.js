'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('jobs', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING
      },
      company: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING
      },
      department: {
        type: Sequelize.ENUM(
          'Sales',
          'Administration',
          'Engineering',
          'Management',
          'Education',
          'Support',
          'Information Technology',
          'Human Resources',
          'Accountancy',
          'Marketing',
          'Finance',
          'Legal Department',
        )
      },
      employment_type: {
        type: Sequelize.ENUM('Full Time', 'Contract', 'Part Time', 'Internship')
      },
      description: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.ENUM('APPROVED', 'PENDING', 'SPAM', 'INACTIVE')
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('jobs');
  }
};