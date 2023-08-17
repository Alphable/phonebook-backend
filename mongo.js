/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const mongoose = require('mongoose')
const url = process.env.MONGODB_URL
mongoose.connect(url).then(response => {
  console.log('connected to MongoDB')
})
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })


const personSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: 3,
      required: true
    },
    number: {
      type: String,
      minLength: 8,
      required: true,
      validate: { validator: (value) => {
        return /^(\d{8,}|\d{2,3}-\d+)$/.test(value)
      } }
    }
  }
)

// modify json pattern of response
personSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
  }
})
module.exports = mongoose.model('Person', personSchema)