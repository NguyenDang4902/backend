const User = require("./../user/model");
const { sendOTP, verifyOTP, deleteOTP } = require("./../OTP/controller");
const { hashData } = require("./../util/hashedPassword");

const resetUserPassword = async ({ email, otp, newPassword }) => {
    try {
        const validOTP = await verifyOTP({ email, otp });
        if (!validOTP) {
            throw Error("Invalid code passed.");
        }

        // update user new password
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/.test(newPassword)) {
            res.json({
                status: "FAILED",
                message: "Password must be 8-16 Characters including at least one uppercase letter, one lowercase letter, one special character and a number"
            })
        }
        const hashedNewPassword = await hashData(newPassword);
        await User.updateOne({ email }, { password: hashedNewPassword });
        await deleteOTP(email);

        return;
    } catch (error) {
        throw error;
    }
}

const sendPasswordResetOTPEmail = async (email) => {
    try {
        // check if account exists
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            throw Error("Invalid email entered");
        }

        const otpDetails = {
            email,
            subject: "WorkoutX Password Reset",
            message: "Here is the code you need to enter to change your email. Please ignore this email if you don't perform this action."
        };
        const createdOTP = await sendOTP(otpDetails);
        return createdOTP;
    } catch (error) {
        throw error;
    }
};

module.exports = { sendPasswordResetOTPEmail, resetUserPassword };