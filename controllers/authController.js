import User from "../models/User.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/Email.js";
import { promisify } from "util";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true; // Serve cookies over HTTPS in production
  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

export const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });

  // Generate a verification token
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  // Verification URL
  const verifyUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/verify/${token}`;
  const message = `Please verify your email: ${verifyUrl}`;

  const htmlMessage = `
  <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
    <h2>Welcome, ${newUser.name}! 🎉</h2>
    <p>Thanks for signing up. Please verify your email by clicking the button below:</p>
    <a href="${verifyUrl}" 
       style="background: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
      Verify Email
    </a>
    <p>If the button doesn't work, copy and paste this link in your browser:</p>
    <p><a href="${verifyUrl}">${verifyUrl}</a></p>
  </div>
`;
  try {
    // Send verification email
    await sendEmail({
      email: newUser.email,
      subject: "Verify your email",
      message,
      html: htmlMessage,
    });

    return res.status(201).json({
      status: "success",
      message: "User created! Please check your email to verify your account.",
    });
  } catch (err) {
    console.error(err);

    // Optionally delete user if email fails
    await User.findByIdAndDelete(newUser._id);

    return next(
      new AppError(
        "There was an error sending the email. Try again later.",
        500
      )
    );
  }
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide email and password!",
    });
  }

  // Find user by email
  const user = await User.findOne({ email }).select("+password");

  // Check if user exists and password is correct
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // Check if user is verified
  if (!user.isVerified) {
    return next(new AppError("Please verify your email first.", 401));
  }

  // Generate JWT token
  createSendToken(user, 200, res);
});

export const verifyEmail = catchAsync(async (req, res, next) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    console.log("Decoded token:", decoded);
    console.log("User found:", user);

    if (!user) {
      return next(new AppError("Invalid verification link", 400));
    }

    user.isVerified = true;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      message: "Email verified successfully! You can now log in.",
    });
  } catch (err) {
    return next(new AppError("Verification link expired or invalid", 400));
  }
});

export const protect = catchAsync(async (req, res, next) => {
  // Getting Token and check it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }
  //2  Verification Token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3 check if the user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  //4  Check if the user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  // Grant access to protected route
  req.user = currentUser;

  next();
});
export const logOut = (req, res) => {
  res.cookie("jwt", "", {
    expires: new Date(Date.now() + 10 * 1000), // Expires in 10 seconds
    httpOnly: true,
  });
  res
    .status(200)
    .json({ status: "success", message: "Logged out successfully." });
};
