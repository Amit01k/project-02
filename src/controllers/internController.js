const internModel = require("../models/internModel")
const collegeModel = require("../models/collegeModel")
const res = require("express/lib/response")


const createIntern = async function (req, res) {
    try {
        let input = req.body
        let email = input.email

        //let collegeFull = input.fullName

        let mobile = input.mobile


        if (!Object.keys(input).length > 0) return res.status(400).send({ error: "Please enter some data" })

        if (!input.name) return res.status(400).send({ error: "please enter name" })

        if (!input.email) return res.status(400).send({ error: "please enter email" })

        if (!input.mobile) return res.status(400).send({ error: "please enter valid mobile number" })

        const mobileAlreadyused = await internModel.findOne({ mobile })

        if (mobileAlreadyused) return res.status(400).send({ status: false, msg: "mobile is  already used" })

        if (!input.collegeId) return res.status(400).send({ error: "please enter College Id" })

        const Email = input.email
        const validateEmail = function (Email) {
            return /^[a-zA-Z0-9+_.-]+@[a-zA-Z.-]+$/.test(Email)
        }
        if (!validateEmail(Email)) {
            return res.status(400).send({ error: "Please enter valid email" })
        }

        const Mobile = input.mobile
        const validateMobile = function (Mobile) {
            return /^([+]\d{2})?\d{10}$/.test(mobile)
        }
        if (!validateMobile(Mobile)) {
            return res.status(400).send({ error: "Please enter valid mobile" })
        }

        let college = req.body.collegeId;
        let collegeId = await collegeModel.findById(college);

        if (!collegeId)
            return res.status(400).send("please provide valid collegeId");


        let collegeAvailable = await collegeModel.findOne({ _id: collegeId, isDeleted: false })

        if (!collegeAvailable) {
            res.status(404).send({ error: "college not found" })
        }


        const emailAlreadyUsed = await internModel.findOne({ email })

        if (emailAlreadyUsed) return res.status(400).send({ status: false, msg: "email already registered" })


        let data = await internModel.create(input)
        res.status(201).send({ status: true, msg: data })
    }
    catch (err) {
        //console.log(err)
        return res.status(500).send({ msg: err.message })
    }
}

const collegeDetails = async function (req, res) {
    try {
        let collegeName = req.query.college

        if (!collegeName)
            return res.status(400).send({ msg: "college name is required" })

        let find = await collegeModel.find({ name: collegeName,isDeleted:false })
        if (!(find).length > 0)
            return res.status(400).send({ msg: "college is not present " })

        let activceCollege = await collegeModel.find({ name: collegeName }).select({ _id: 1 })

        if (!activceCollege)
            return res.status(400).send({ msg: "id is not present" })

        let interns = await internModel.find({ collegeId: activceCollege, isDeleted: false }).select({ name: 1, email: 1, mobile: 1, _id: 1 })

        if (!interns)
            return res.status(400).send({ msg: "interns is not present" })

        let result = await collegeModel.find({ name: collegeName }).select({ name: 1, fullName: 1, logoLink: 1, _id: 0 })

        const obj = {
            name: result[0].name,
            fullName: result[0].fullName,
            logoLink: result[0].logoLink,

            intrests: interns

        }
        res.status(200).send({ data: obj })
    }
    catch (err) {
        
        return res.status(500).send(err.message)
    }


}

module.exports.collegeDetails = collegeDetails

module.exports.createIntern = createIntern