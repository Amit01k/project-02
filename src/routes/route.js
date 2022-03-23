const express = require('express');
const { route } = require('express/lib/application');
const router = express.Router();
//const CowinController= require("../controllers/cowinController")

const collegeController=require('../controllers/collegeController')


const interController=require("../controllers/internController")



router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post("/functionup/colleges",collegeController.createcollege)

router.post("/functionup/interns",interController.createIntern)


router.get("/functionup/collegeDetails",interController.collegeDetails)



module.exports = router;