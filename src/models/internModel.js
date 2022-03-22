const mongoose=require('mongoose')

const ObjectId=mongoose.Schema.Types.ObjectId

const internModel=new mongoose.Schema({
    name:String,
    email: {
        type: String,

        unique: true,
        required: true,
        validate: {
            validator: function (email) {
                return /^[a-zA-Z0-9+_.-]+@[a-zA-Z.-]+$/.test(email)
            },
            message: "enter valid email address",

        }

    },
    mobile : {
        type : String,
        unique : true,
        required : true,
        validate: {
            validator: function (mobile) {
                return /^([+]\d{2})?\d{10}$/.test(mobile)
            },
            message: "enter valid Mobile Number",

        }
        // minlength : 10,
        // maxlength : 12,
        // pattern : "1?\W*([2-9][0-8][0-9])\W*([2-9][0-9]{2})\W*([0-9]{4})(\se?x?t?(\d*))?",

    },
    collegeId:{
        type:ObjectId,
        ref:"college",

    },
    isDeleted:{
        type:Boolean,
        default:false,
    
    }
},
{timestamps:true})

module.exports=new mongoose.model("intern",internModel)