const express = require("express");
const router = express.Router();
const {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");
const validateToken = require("../middleware/validateTokenHandler");
router.use(validateToken);
router.route("/").get(getContacts).post(createContact);
// router.route("/").post(createContact); Instead of writing like this, u can directly like write how it is depicted above
//Doing the same down too
router.route("/:id").get(getContact).put(updateContact).delete(deleteContact);

module.exports = router;
