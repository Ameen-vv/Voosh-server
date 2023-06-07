import mongoose from 'mongoose'

const url = process.env.DB_LINK 
// ?? 'mongodb://localhost:27017/voosh'

const connection = () => {
    mongoose.connect(process.env.DB_LINK ).then(()=>{
        console.log('db connected')
    })
}

export default connection