const collegeModel = require("../models/collegeModel")
const collegeController=require("../models/collegeModel")

const createcollege=async function(req,res){
    try{
    let input=req.body

    let collegeName=input.name

    let fullCollegeName=input.fullName
    

    let findClg=await collegeModel.findOne({name:collegeName})

    if(findClg) return res.status(400).send("college already exist")

    let findClg1=await collegeModel.findOne({fullName:fullCollegeName})
    
    if(findClg1) return res.status(400).send("clg fullName already exists")

    if(!Object.keys(input).length>0) return res.status(200).send("give some data to create college")

    if(!input.name) return res.status(400).send("please enter name")
    
    if(!input.fullName) return res.status(400).send("please enter full name of college")

    if(!input.logoLink) return res.status(400).send("please enter logoLink")

    let data=await collegeModel.create(input)
    res.status(201).send({msg:true,data})
    }
    catch(err){
        return res.status(500).send(err.message)
    }

}
module.exports.createcollege=createcollege