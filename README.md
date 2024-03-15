# KOA_Sample

This template is the scaffolding for KOA, and its front-end template is [Wave_UI_Sample](https://github.com/stormdush/wave_ui_sample).

The database is mongdb.

## Customize configuration

See `config/debug.json` (default)

## Project Setup

###### This program is based on nodemon for Hot-Reload and Debug, and use pm2 for maintenance

```sh
npm install -g nodemon
npm install -g pm2
```

###### Initialized data in mongoDB for testing

```sh
node initData.js --NODE_ENV=debug
```

###### Start

```sh
npm run start
```

###### Other patterns

```sh
npm run dev/test/pro    // Automatically finds the corresponding file
```

```
"scripts": {
        "init": "initData.js --NODE_ENV=debug",
        "start": "nodemon app.js --NODE_ENV=debug",
        "dev": "pm2 start ecosystem.config.js --env dev",
        "test": "pm2 start ecosystem.config.js --env test",
        "pro": "pm2 start ecosystem.config.js --env pro",
        "logs": "pm2 logs"
    },
```

## Routers setting

Api router needs to be authenticated by jwt middleware
Public router does not require

#### api.js

```
router.use(jwtVerify);
```

## controlers

`controlers/index.js` reads and consolidates all the files in the current directory and exports them

#### example:

###### controllers/user.js

```
'use strict';
const modelName = require('../models/user').name;
const { getAllRecords } = require('../db/dbHelper');

const user = async (ctx, next) => {
    const users = await getAllRecords(modelName, {});

    if (users) {
        const formattedUsers = users.map((user) => ({
            username: user.username,
            password: user.password,
            tel: user.tel,
        }));

        ctx.data = { users: formattedUsers };
        ctx.msg = 'OK';
        return next();
    } else {
        throw { code: 401, message: 'Unauthorized!' };
    }
};

module.exports = user;
```

###### api.js

```
const controllers = require('../controllers');
router.get('/user', controllers.user);
```

## Middlewares

#### [Cors](https://www.npmjs.com/package/koa2-cors)

Allows web pages to request resources from servers in different domains, addressing the limitations of the browser's same-origin policy.

```
'use strict';
const cors = require('koa2-cors');

// Create cors middleware
const corsControl = cors({
    origin: 'https://192.168.10.101:8000',   // If you want to send cookies, Access-Control-Allow-Origin cannot be set to '*'.
    exposeHeaders: [
        'WWW-Authenticate',
        'Server-Authorization',
        'Authorization',
        'SessionID',
    ],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'SessionID']
});

module.exports = {
    corsControl,
};

// Options
// origin
// Configures the Access-Control-Allow-Origin CORS header. expects a string. Can also be set to a function, which takes the ctx as the first parameter.

// exposeHeaders
// Configures the Access-Control-Expose-Headers CORS header. Expects a comma-delimited array.

// maxAge
// Configures the Access-Control-Max-Age CORS header. Expects a Number.

// credentials
// Configures the Access-Control-Allow-Credentials CORS header. Expects a Boolean.

// allowMethods
// Configures the Access-Control-Allow-Methods CORS header. Expects a comma-delimited array , If not specified, default allowMethods is ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'].

// allowHeaders
// Configures the Access-Control-Allow-Headers CORS header. Expects a comma-delimited array . If not specified, defaults to reflecting the headers specified in the request's Access-Control-Request-Headers header.
```

#### [jwt](https://www.npmjs.com/package/jsonwebtoken)

An implementation of JSON Web Tokens.

```
jwt.verify(token, config.secret, function (err, decoded) {
    if (err) {
        logger.error(err);
        throw { code: 401, message: 'Unauthorized!' };
    }
});
```

#### [logger]()

Developing with [Winston](https://www.npmjs.com/package/winston) and [winston-daily-rotate-file](https://www.npmjs.com/package/winston-daily-rotate-file), checks for the existence of a logs folder at startup, `xxx.log` files are automatically generated by date. The command line outputs the logs in debug mode and hides them in all other modes.

```
2024-03-15 10:49:50 info:       POST 200 /login | Required Parameters: {"username":"admin","password":"pwd"} | Responsed Parameters: {"code":200,"message":"Login successful!","data":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTA0NzQ1OTAsImRhdGEiOnsidXNlciI6ImFkbWluIiwicHdkIjoicHdkIn0sImlhdCI6MTcxMDQ3MDk5MH0.gm0Zt0nzKz1HdTyOEOc_QVcJ9MdMYJMKm-EBeHm1om4"}} | From: ::ffff:192.168.10.102 | Ping: 3ms
2024-03-15 10:49:50 info:       OPTIONS 204 /user | Required Parameters: {} | Responsed Parameters: undefined | From: ::ffff:192.168.10.102 | Ping: 0ms
2024-03-15 10:49:50 info:       GET 200 /user | Required Parameters: {} | Responsed Parameters: {"code":200,"message":"OK","data":{"users":[{"username":"user1","password":"pwd1","tel":"18611112222"},{"username":"user2","password":"pwd2","tel":"18611113333"}]}} | From: ::ffff:192.168.10.102 | Ping: 2ms
```

## License

Licensed under [MIT](./LICENSE).
