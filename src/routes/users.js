var express = require('express');
const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');


const mongoURI = "mongodb+srv://dasrupdip04:Rupdip2004@pinterestclone1.bts7qwp.mongodb.net/?retryWrites=true&w=majority&appName=PinterestClone1"
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected!');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err; // Important for debugging in Vercel
  }
}



const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String },
  fullname: { type: String, required: true },

  profileImage: { type: String, default: 'https://imgs.search.brave.com/xHzpYnpYxxMLUf0Pz6pzK4xjitSakoy3Kd9_Js2hGcA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzE3Lzkw/LzQxLzE3OTA0MTJm/MjNhZmU1NDA2YzY3/ZGNjNDBlNWY0OTcy/LmpwZw' },
  posts : [{type:mongoose.Schema.Types.ObjectId, ref:'Post'}],


  // boards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Board' }],
  // savedPins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pin' }]

});

// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 12);
//   next();
// });
userSchema.plugin(plm);
module.exports = mongoose.model('User', userSchema);


