const collegeModel = require("../models/collegeModel")


const isValid = (value) => {
    if (typeof value === "undefined" || value === null)
        return false
    if (typeof value === "string" && value.trim().length === 0)
        return false
    else
        return true
}


const isValidBody=(body)=>{
    return Object.keys(body).length>0
}

const createcollege=async function(req,res){
    try{
    let input=req.body

    if(!isValidBody(input)) return res.status(200).send({status:false,msg:"give some data to create college"})

    // let collegeName=input.name

    // let fullCollegeName=input.fullName

    // this is your college link=>https://functionup-stg.s3.ap-south-1.amazonaws.com/thorium/mits.jpg

    const{name,fullName,logoLink}=input

    // if(!Object.keys(input).length>0) return res.status(200).send("give some data to create college")

    if(!isValid(name)) return res.status(400).send({status:false,msg:"please enter name"})
    
    if(!isValid(fullName)) return res.status(400).send({status:false,msg:"please enter full name of college"})

    if(!isValid(logoLink)) return res.status(400).send({status:false,msg:"please enter logoLink"})

    let findClg=await collegeModel.findOne({name})

    if(findClg) return res.status(400).send({status:false,msg:"college name already exist"})

    let findFullName=await collegeModel.findOne({fullName})

    if(findFullName) return res.status(400).send({status:false,msg:"college fullname already exists"})

    let data=await collegeModel.create(input)
    res.status(201).send({msg:true,data})
    }
    catch(err){
        return res.status(500).send(err.message)
    }

}
module.exports.createcollege=createcollege