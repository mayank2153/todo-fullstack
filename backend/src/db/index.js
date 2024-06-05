const mongoose = require("mongoose");


connectDB=async ()=>{
  try {
    connectionInstance=await mongoose.connect(
      "mongodb+srv://pushkar1713:cUHs92AswtTclzXK@cluster0.w6lkxlt.mongodb.net/"
    );
    console.log("Mongo Connected")
    console.log(connectionInstance.connection.host)
  } catch (error) {
    console.log("MongoDb connection error ", error);
  }
}
module.exports = connectDB;



