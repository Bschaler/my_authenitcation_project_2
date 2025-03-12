// backend/db/models/user.js
'use strict';

const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define associations here
    }
  }

  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [4, 30], // username must be 4-30 characters
          isNotEmail(value) { // custom validator to ensure it's not an email
            if (Validator.isEmail(value)) {
              throw new Error('Cannot be an email.');
            }
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 256], // email must be 3-256 characters
          isEmail: true, // must be a valid email format
        },
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60], // bcrypt hashes are always 60 characters
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
      defaultScope: {
        attributes: {
          exclude: ['hashedPassword', 'email', 'createdAt', 'updatedAt'], // Exclude sensitive fields by default
        },
      },
      scopes: {
        // Named scope to exclude password
        withoutPassword: {
          attributes: { exclude: ['hashedPassword'] },
        },
        // Named scope to include all fields (for login or authentication)
        loginUser: {
          attributes: {}, // No exclusion, include all fields
        },
      },
    }
  );
  
  return User;
};