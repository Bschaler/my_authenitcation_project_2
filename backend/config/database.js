// backend/config/database.js
const config = require('./index');

module.exports = {
  development: {
    storage: config.dbFile,                 // SQLite file location
    dialect: "sqlite",                      // Use SQLite in development
    seederStorage: "sequelize",             // Store seeder execution history in the database
    logQueryParameters: true,               // Log query parameters for debugging
    typeValidation: true                    // Enable strict type validation
  },
  production: {
    use_env_variable: 'DATABASE_URL',       // Use DATABASE_URL from environment
    dialect: 'postgres',                    // Use PostgreSQL in production
    seederStorage: 'sequelize',             // Store seeder execution history
    dialectOptions: {
      ssl: {
        require: true,                      // Require SSL for security
        rejectUnauthorized: false           // Allow self-signed certificates
      }
    },
    define: {
      schema: process.env.SCHEMA           // Set schema for PostgreSQL
    }
  }
};
