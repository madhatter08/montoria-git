import mongoose from 'mongoose';

const connectdb = async () => { 
    mongoose.connection.on('connected', ()=>console.log("Database connected"))
    await mongoose.connect(`${process.env.MONGODB_URI}/montoriadb`)
}
export default connectdb;