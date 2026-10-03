const mongoose =  require("mongoose")

const dbConnect = async() => {
    try {
        const connect = await mongoose.connect("mongodb://localhost:27017/PCW_Db");
        if(!connect){
            console.log("connection failed")
            process.exit(1);
        }

        console.log("connection successfully with Pcw Database");
    } catch (err) {
        console.error("server error from database", err)
    }
}

module.exports = dbConnect;