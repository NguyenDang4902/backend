require('./config/db');

const app = require('express')();
const port = process.env.PORT || 3000;

const UserRouter = require('./user/user')
const OTPRouter = require('./OTP/OTP')
const ForgotPasswordRouter = require('./forget_pass/forget_pass');
const UpdateProfile = require('./update/update_profile');
const UpdatePassword = require('./update/update_password');
const UpdateEmail = require('./update/update_email');

const bodyParser = require('express').json;
app.use(bodyParser());

app.use('/user', UserRouter)
app.use('/otp', OTPRouter)
app.use('/forgot_password', ForgotPasswordRouter);
app.use('/update_profile', UpdateProfile);
app.use('/update_password', UpdatePassword);
app.use('/update_email', UpdateEmail);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})