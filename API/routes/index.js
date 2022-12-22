const OrganizationRouter = require("./organization");
const PartierRouter = require("./partier");
const ShuttleRouter = require("./shuttle");
const TownRouter = require("./town");
const EventRouter = require("./event");
const ShuttleMemberRouter = require("./shuttleMember");
const ImageRouter = require("./image");
const router = require("express").Router();

router.use("/organization", OrganizationRouter);
router.use('/partier', PartierRouter);
router.use('/shuttle', ShuttleRouter);
router.use('/town', TownRouter);
router.use('/event', EventRouter);
router.use('/shuttleMember', ShuttleMemberRouter);
router.use('/image', ImageRouter);

module.exports = router;