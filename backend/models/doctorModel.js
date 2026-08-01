import mongoose from "mongoose";

const doctorSchema=new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    image:{type:String, required:true},
    speciality:{type:String, required:true},
    degree:{type:String, required:true},
    experience:{type:String, required:true},
    about:{type:String, required:true},
    available:{type:Boolean, default:true},
    fees:{type:Number, required:true},
    address:{type:Object, required:true},
    date:{type:Number, required:true},//to know when the doctor was added in the database
    slots_booked:{type:Object, default:{}},
},{minimize:false})
//By default, Mongoose removes fields with no keys or elements to keep the database tidy. Setting minimize: false allows you to store empty structures explicitly.

const doctorModel=mongoose.models.doctor || mongoose.model('doctor', doctorSchema)

export default doctorModel 