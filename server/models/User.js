const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String
  },
  prenom: {
    type: String
  },
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
  },
  tel: {
    type: String
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Minimum password length is 6 characters'],
  },

});


// fire a function before doc saved to db
userSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//creating a static methode for this model for login
//in short this function checks if we have a user with the same email we find it and grab
//then we compare hashed passwords

userSchema.statics.login = async function(email, password){
  const user = await this.findOne({email});
  if(user){ 
        auth =  await bcrypt.compare(password, user.password);
        if (auth){
          //if the passwords are compatible
          return user;
        }
        throw Error("incorrect password");
  }
  throw Error("incorrect email");
}

const User = mongoose.model('User', userSchema);

module.exports = User;