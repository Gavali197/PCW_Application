const express = require("express")
const router = express.Router()

const  {createCommitteeMember, loginUser, registerStudent} = require("../controllers/UserController")

router.post("/login", loginUser)
router.post("/register", registerStudent)
router.post("/addMember", createCommitteeMember)