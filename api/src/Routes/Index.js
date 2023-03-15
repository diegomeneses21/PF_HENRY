const { Router } = require("express");
const tradesRouter = require("./tradesRouter");
const clientsRouter = require("./clientsRouter");
const superAdminsRouter = require("./superAdminsRouter");
const mercadoPagoRouter = require("./mercadoPagoRouter");
// const validateLogin = require('../Routes/validate');

const routes = Router();

routes.use("/trades", /*validateLogin*/ tradesRouter);
routes.use("/clients", /*validateLogin,*/ clientsRouter);
routes.use("/superadmins", superAdminsRouter);
routes.use("/payment", mercadoPagoRouter);

module.exports = routes;
