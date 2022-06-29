const Router = require("express");
const controller = require("../controllers/AuthController");
const { check } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");
const rolesMiddleware = require("../middleware/rolesMiddleware");

const router = new Router();

router.post(
  "/registration",
  [
    check(
      ["email", "password", "gender", "firstName", "lastName", "dateOfBirth"],
      "Field should not be empty"
    ).notEmpty(),
    check(
      ["email", "firstName", "lastName", "password"],
      "Must be at least 3 chars long and no more than 50 "
    ).isLength({
      min: 3,
      max: 50
    }),
    check(["email"], "Invalid email").isEmail(),
    check(["gender"], "Invalid value (Should be Male or Female)").isIn([
      "Male",
      "Female"
    ]),
    check(["dateOfBirth"], "Invalid date timestamp").custom((value, { req }) =>
      new Date(value).getTime()
    ),
    check(["roles"], "Invalid roles").isArray()
  ],
  controller.registration
);
router.post(
  "/login",
  [check(["email", "password"], "Field should not be empty").notEmpty()],
  controller.login
);
router.get("/logout/:userId", authMiddleware, controller.logout);
router.get("/users", rolesMiddleware(["ADMIN"]), controller.getUsers);
router.get(
  "/users/online",
  rolesMiddleware(["ADMIN"]),
  controller.getOnlineUsers
);
router.get("/users/:userId", rolesMiddleware(["ADMIN"]), controller.getUser);

module.exports = router;
