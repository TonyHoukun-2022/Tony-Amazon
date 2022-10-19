import mongoose from 'mongoose'

const connectDB = async () => {
  await mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('mongo is connected'))
    .catch((error) => console.log(error))
}

export const disconnectDB = async () => {
  mongoose.disconnect(() => console.log('mongoose is disconnected'))
}

export default connectDB
