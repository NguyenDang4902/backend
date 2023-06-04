require('./config/db');

const app = require('express')();
const port = process.env.PORT || 3000;

const UserRouter = require('./user/user')
const OTPRouter = require('./OTP/OTP')
const ForgotPasswordRouter = require('./forget_pass/forget_pass');

const bodyParser = require('express').json;
app.use(bodyParser());

app.use('/user', UserRouter)
app.use('/otp', OTPRouter)
app.use('/forgot_password', ForgotPasswordRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})