var express = require('express');
var dashboardRouter = express.Router();

const {
    dashboardCount
} = require("../controllers/Dashboard/dashboard");

dashboardRouter.get('/dashboard-count',dashboardCount);

module.exports = dashboardRouter;
