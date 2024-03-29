'use strict';
const jwt = require('jsonwebtoken');
const config = require('config');
const modelName = require('../models/administrator').name;
const { getRecord } = require('../db/dbHelper');

const login = async (ctx, next) => {
    const { username, password } = ctx.request.body;

    const adminUser = await getRecord(modelName, {
        username,
        password,
    });

    if (adminUser) {
        // Create JWT after find user
        const token = jwt.sign(
            {
                exp: Math.floor(Date.now() / 1000) + 60 * 60,
                data: {
                    user: adminUser.username,
                    pwd: adminUser.password,
                },
            },
            config.secret
        );

        // Set token in headers
        ctx.set('Authorization', token);
        ctx.data = { token: token };
        ctx.msg = 'Login successful!';
        return next();
    } else {
        throw { code: 401, message: 'Unauthorized!' };
    }
};

module.exports = login;
