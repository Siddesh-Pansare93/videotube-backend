import dotenv from "dotenv"
import connectDB from "./db/index.js";

dotenv.config(
    {
        path : "./env"
    }
)

connectDB() ; 


















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