// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// // const userSchema = new mongoose.Schema({
// //   name: {
// //     type: String,
// //     required: true,
// //     trim: true
// //   },
// //   email: {
// //     type: String,
// //     required: true,
// //     unique: true,
// //     lowercase: true
// //   },
// //   password: {
// //     type: String,
// //     required: true
// //   }
// // });


// const userSchema = new mongoose.Schema({
//     name: { type: String, required: true, trim: true },
//     email: { type: String, required: true, unique: true, lowercase: true },
//     password: { type: String, required: true },
//     resetToken: String,
//     resetTokenExpire: Date
//   });
  

// // Hash password before saving
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// module.exports = mongoose.model('User', userSchema);
