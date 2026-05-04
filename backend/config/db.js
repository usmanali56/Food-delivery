import mongoose from "mongoose";
 export const connectDB=async ()=>{
    await mongoose.connect('mongodb+srv://finalyear:87654321@cluster0.i4dzfnx.mongodb.net/food-del').then(()=>console.log("db connected"))
}