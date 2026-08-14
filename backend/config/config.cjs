require('dotenv').config();

module.exports = {
    development: {
        dialect: 'sqlite',
        storage: process.env.DATABASE_STORAGE
    },

    test: {
        dialect: 'sqlite',
        storage: ':memory:'
    },

    production: {
        dialect: 'sqlite',
        storage: process.env.DATABASE_STORAGE
    }
};