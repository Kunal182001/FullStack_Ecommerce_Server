const mongoose=require('mongoose');
const { Category } = require('./Category');

const productSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    discription:{
        type:String,
        required:true
    },
    techData: {
        type: Map,
        of: String,
        default: {}
    },
    images: [
        {
          type: String,
          required: true,
        },
    ],
    brand:{
        type:String,
        default:''
    },
    oldprice:{
        type:Number,
        default:0
    },
    newPrice:{
        type:Number,
        default:0
    },
    disCount:{
        type:Number,
        default:0
    },
    category:{
        type:mongoose.Schema.Types.ObjectID,
        ref:'Category',
        required:true
    },
    subcat:{
        type:String,
        required:true
    },
    countInstock:{
        type:Number,
        default:0
    },
    rating:{
        type:Number,
        default:0
    },
    isFeatured:{
        type:Boolean,
        required:true
    },
    isnewarrival:{
        type:Boolean,
        required:true
    },
    ispopproduct:{
        type:Boolean,
        required:true
    },
    dataCreated:{
        type:Date,
        default:Date.now,
    }

})

exports.Product=mongoose.model("Product",productSchema);