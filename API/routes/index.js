const OrganizationRouter = require("./organization");
const PartierRouter = require("./partier");
const ShuttleRouter = require("./shuttle");
const TownRouter = require("./town");
const EventRouter = require("./event");
const ShuttleMemberRouter = require("./shuttleMember");
const ImageRouter = require("./image");
const UserRouter = require("./user");
const router = require("express").Router();

router.use("/1.0/organization", OrganizationRouter);
router.use('/1.0/partier', PartierRouter);
router.use('/1.0/shuttle', ShuttleRouter);
router.use('/1.0/town', TownRouter);
router.use('/1.0/event', EventRouter);
router.use('/1.0/shuttleMember', ShuttleMemberRouter);
router.use('/1.0/image', ImageRouter);
router.use('/1.0/user', UserRouter);

module.exports = router;