const express = require("express")
const router = express.Router()
const AccountControllers = require("../app/controllers/AccountControllers")

//Sign in router
router.use("/signIn", AccountControllers.formSignIn)
router.post("/signInProcess", AccountControllers.signInProcessing)

//Sign up router
router.use("/signUp", AccountControllers.formSignUp)
router.post("/signUpProcess", AccountControllers.signUpProcessing)

//Change password router
router.use("/changePassword", AccountControllers.formchangePassword)
router.patch("/changePasswordProcess", AccountControllers.changePasswordProcessing)

//Forget password router
router.get("/forgetPassword", AccountControllers.forgetPass)

//Log out router
router.use("/logOut", AccountControllers.logout)

module.exports = router
