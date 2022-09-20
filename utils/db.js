import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log(' Mongoose is connected'))
  } catch (e) {
    console.log('could not connect')
    // process.exit(1)
  }
}

export const disconnectDB = async () => {
  await mongoose.disconnect(() => console.log('mongoose is disconnected'))
}

export default connectDB
