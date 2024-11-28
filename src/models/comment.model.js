import mongoose  from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'


const commentSchema = mongoose.Schema({
    content : {
        type : String , 
        required  :true 
    },
    Video :  {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'Video' ,
    },
    owner :  {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'User'
    }
})

export const Comment =  mongoose.model("Comment" , commentSchema)