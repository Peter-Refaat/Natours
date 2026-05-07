import { Router } from "express";
import { updateMe, getAllUsers, createUser, getUser, updateUser, deleteUser } from "../controllers/userController.js";
import { signup, login, forgotPassword, resetPassword, protect, updatePassword } from "../controllers/authController.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);
router.patch(
  "/updateMyPassword",
  protect,
  updatePassword,
);

router.patch("/updateMe", protect, updateMe);

router
  .route("/")
  .get(getAllUsers)
  .post(createUser);
router
  .route("/:id")
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

export default router;
