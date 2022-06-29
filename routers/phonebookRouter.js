const Router = require("express");
const controller = require("../controllers/PhonebookController");
const { check } = require("express-validator");

const router = new Router();

router.get("/records", controller.getAllRecords);
router.get("/:userId/records", controller.getRecords);
router.post(
  "/:userId/records",
  [
    check(["name", "phoneNumbers"], "Field should not be empty").notEmpty(),
    check(
      ["name"],
      "Must be at least 3 chars long and no more than 50"
    ).isLength({
      min: 3,
      max: 50
    }),
    check(["phoneNumbers"], "Must be at least one number").isLength({
      min: 1
    })
  ],
  controller.createRecord
);
router.put(
  "/:userId/records/:recordId",
  [
    check(["name", "phoneNumbers"], "Field should not be empty").notEmpty(),
    check(
      ["name"],
      "Must be at least 3 chars long and no more than 50"
    ).isLength({
      min: 3,
      max: 50
    }),
    check(["phoneNumbers"], "Must be at least one number").isLength({
      min: 1
    })
  ],
  controller.updateRecord
);
router.delete("/:userId/records/:recordId", controller.deleteRecord);
router.get("/:userId/records/:recordId", controller.getRecord);

module.exports = router;
