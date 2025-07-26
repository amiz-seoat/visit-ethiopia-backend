import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    trim: true,
    },
    email: {
    type: String,
    required: [true, 'A user must have an email'],
    unique: true,
    lowercase: true,
    validate: {
      validator: function (val) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val);
      },
      message: 'Please provide a valid email address',
    },
    },
    password: {
      type: String,
      required: [true, 'A user must have a password'],
      minlength: 8,
      select: false, 
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        // This only works on CREATE and SAVE
        validator: function (val) {
          return val === this.password;
        },
        message: 'Passwords do not match',
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    role: {
        type: String,
        enum: ['user', 'admin','guide'],
        default: 'user',
        },
    isVerified: { type: Boolean, default: false },
     passwordChangedAt: Date,
     passwordResetToken: String,
     passwordResetExpires: Date,
});

userSchema.pre('save', async function (next) {
  // Only run this function if password was modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete confirmPassword field
  this.passwordConfirm = undefined;
  next();
});
// Instance method to check if password is correct
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  // If the user has changed password after the token was issued
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const User = mongoose.model('User', userSchema);

export default User;