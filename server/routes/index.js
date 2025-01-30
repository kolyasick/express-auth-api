import { Router } from "express"
import authController from "../controllers/authController.js"
import { check, ExpressValidator } from "express-validator"
import postController from "../controllers/postController.js"
import authMiddleware from "../middlewares/authMiddleware.js"

const router = Router()

router.get("/", (req, res) => {
	res.json({ message: "hi" })
})

/// AUTH BEGIN
router.post(
	"/register",
	[
		check("email", "Email is required").notEmpty(),
		check("email", "Incorrect email").isEmail(),
		check("password", "Password must be 6-15 characters").isLength({
			min: 6,
			max: 15,
		}),
	],
	authController.register
)
router.post("/login", authController.login)
router.get("/logout", authController.logout)
router.get("/get-user", authController.getUser)
router.get("/activate/:link", authController.activate)
/// AUTH END


// POST CRUD BEGIN
router.post(
	"/post/add",
	authMiddleware,
	[
		check("title", "Title is required").notEmpty(),
		check("title", "Title must be 6-20 characters").isLength({ min: 6, max: 20 }),
	],
	postController.create
)
router.patch(
	"/post/:id/edit",
	[
		check("title", "Title is required").notEmpty(),
		check("title", "Title must be 6-20 characters").isLength({ min: 6, max: 20 }),
	],
	authMiddleware,
	postController.edit
)
router.get("/posts/get", authMiddleware, postController.findAll)
router.get("/post/:id/get", authMiddleware, postController.findOne)
router.delete("/post/:id/delete", authMiddleware, postController.delete)
/// POST CRUD END

export default router
