const internModel = require("../models/internModel")
const collegeModel = require("../models/collegeModel")
const res = require("express/lib/response")

const isValidBody = (body) => {
    return Object.keys(body).length > 0
}

const isValid = (value) => {
    if (typeof value === "undefined" || value === null) return false

    if (typeof value === "string" && value.trim().length === 0)
        return false
    else return true
}



const createIntern = async function (req, res) {
    try {
        let input = req.body

        const { name, email, mobile, collegeId } = input


        if (!isValidBody(input))
            return res.status(400).send({ status: false, msg: "Please enter some data" })

        if (!isValid(name))
            return res.status(400).send({ status: false, msg: "please enter name" })

        if (!isValid(email))
            return res.status(400).send({ status: false, msg: "please enter email" })

        if (!isValid(mobile))
            return res.status(400).send({ status: false, msg: "please enter valid mobile number" })

        const mobileAlreadyused = await internModel.findOne({ mobile })

        if (mobileAlreadyused)
            return res.status(400).send({ status: false, msg: "mobile is  already used" })

        if (!isValid(collegeId))
            return res.status(400).send({ status: false, msg: "please enter College Id" })

        // const email = email
        const validateEmail = function (email) {
            return /^[a-zA-Z0-9+_.-]+@[a-zA-Z.-]+$/.test(email)
        }
        if (!validateEmail(email)) {
            return res.status(400).send({ status: false, msg: "Please enter valid email" })
        }

        const validateMobile = function (mobile) {
            return /^([+]\d{2})?\d{10}$/.test(mobile)
        }
        if (!validateMobile(mobile)) {
            return res.status(400).send({ status: false, msg: "Please enter valid mobile" })
        }

        let college = await collegeModel.findById(collegeId);

        if (!college)
            return res.status(400).send({ status: false, msg: "please provide valid collegeId" });


        let collegeAvailable = await collegeModel.findOne({ _id: collegeId, isDeleted: false })

        if (!collegeAvailable) {
            res.status(404).send({ status: false, msg: "college not found" })
        }


        const emailAlreadyUsed = await internModel.findOne({ email })

        if (emailAlreadyUsed)
            return res.status(400).send({ status: false, msg: "email already registered" })


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
            return res.status(400).send({ status: false, msg: "college name is required" })

        let find = await collegeModel.find({ name: collegeName, isDeleted: false })

        if (!(find).length > 0)
            return res.status(400).send({ status: false, msg: "college is not present " })

        let activceCollege = await collegeModel.find({ name: collegeName }).select({ _id: 1 })

        let interns = await internModel.find({ collegeId: activceCollege, isDeleted: false }).select({ name: 1, email: 1, mobile: 1, _id: 1 })

        if (!interns)
            return res.status(400).send({ status: false, msg: "interns is not present" })

        let result = await collegeModel.find({ name: collegeName }).select({ name: 1, fullName: 1, logoLink: 1, _id: 0 })

        const obj = {
            name: result[0].name,
            fullName: result[0].fullName,
            logoLink: result[0].logoLink,

            intrests: interns

        }
        res.status(200).send({ status: true, data: obj })
    }
    catch (err) {

        return res.status(500).send({ status: false, msg: err.message })
    }


}

module.exports.collegeDetails = collegeDetails

module.exports.createIntern = createIntern