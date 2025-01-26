const express = require('express');
// const authRoute = require('./authRoute');
const chat =require("./chatRoute");

const router = express.Router();

const defaultRoutes = [
    // {
    //     path: '/auth',
    //     route: authRoute,
    // },
    {
        path:'/chat',
        route: chat,
    }
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;
