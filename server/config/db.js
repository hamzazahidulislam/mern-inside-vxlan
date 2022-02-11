/** @format */

const mongoose = require('mongoose')

const connectDB = async () => {
  await mongoose.connect('mongodb://10.0.1.30:27017/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true
  })

  console.log('MongoDB Connected')
}

module.exports = connectDB
