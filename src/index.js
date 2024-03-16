import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config(
    {
        path : "./env"
    }
)

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000 , () => {
        console.log(` Server listening on port : ${process.env.PORT}` )
    })
})
.catch((err) => {
    console.log("Mongo Db connection failed " , err)
}) 


















//  --------------------------FIRST APPROACH -------------------


// import  express  from "express";

// (async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("errror" , (error) => {                 // ------------db connect hua hai par humari express app db se baat nhi kar paa rhi hai voh scenario handle karne ke liye 
//             console.log("ERR : " ,error)
//         })
//         app.listen(process.env.PORT , () =>{
//             console.log(`app listening on port :  ${process.env.PORT}`);
//         })
//     } catch (error) {
//         console.log("ERROR : " , error) ; 
//         throw err ; 
//     }
   
// })()