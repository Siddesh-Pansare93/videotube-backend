import mongoose from 'mongoose'

const playlistSchema  = mongoose.Schema({
    name :  {
        type: String,
        required : true
    },
    description : {
        type  : String , 
        required : true
    },
    Videos : { 
        [
            type : mongoose.Schema.Types.ObjectId ,
            ref : 'Videos'
        ]
    },
    owner :  {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'User'
    }
},{
    timestamps : true
})

export const Playlist = mongoose.model("Playlist" , playlistSchema)