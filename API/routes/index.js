const OrganizationRouter = require("./organization");
const PartierRouter = require("./partier");
const EventRouter = require("./event");
const router = require("express").Router();

router.use("/organization", OrganizationRouter);
router.use("/partier", PartierRouter);
router.use("/event", EventRouter);

module.exports = router;
