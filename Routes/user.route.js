const Router = require("express");
const router = Router();
const {
  createProduct,
  updateUser,
  updateImagesUser,
  getUserLogged,
  deleteProduct,
  updateItemsSectionTwo,
  updateStyles,
  updateFooter,
} = require("../controllers/user.controller.js");
const { asureAuth } = require("../middlewares/authenticated.js");
const configureCloudinary = require("../utils/cloudinary.js");

const multipart = require("connect-multiparty");

const md_upload = multipart({ uploadDir: "./uploads" });

router.get("/", asureAuth, getUserLogged);

router.post(
  "/product",
  [asureAuth, configureCloudinary, md_upload],
  createProduct
);

router.delete(
  "/product/:product_id",
  [asureAuth, configureCloudinary],
  deleteProduct
);
router.patch(
  "/update",
  [asureAuth, configureCloudinary, md_upload],
  updateImagesUser
);
router.patch(
  "/update/item/:id_item",
  [asureAuth, configureCloudinary, md_upload],
  updateItemsSectionTwo
);
router.patch("/update/user", asureAuth, updateUser);
router.patch("/update/styles", asureAuth, updateStyles);
router.patch("/update/footer", asureAuth, updateFooter);

module.exports = router;
