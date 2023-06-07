import mongoose from "mongoose";
const Schema = mongoose.Schema

const orderSchema = new Schema({
    user_id:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    },
    sub_total:Number,
    phone_number:Number,
    date:{
        type:Date,
        default:Date.now()
    }
})


const orderModel = mongoose.model('Orders',orderSchema)
export default orderModel