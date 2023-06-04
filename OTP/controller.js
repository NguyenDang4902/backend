const OTP = require("./model");
const generateOTP = require("./../util/generateOTP");
const sendEmail = require("./../util/sendEmail");
const { AUTH_EMAIL } = process.env;

const verifyOTP = async ({ email, otp }) => {
    try {
        if (!(email && otp)) {
            throw Error("Provide values for email, otp");
        }

        // ensure otp exists
        const matchedOTPRecord = await OTP.findOne({
            email,
        });

        if (!matchedOTPRecord) {
            throw Error("No OTP record found!");
        }

        const { expiresAt } = matchedOTPRecord;

        // check if it's expired
        if (expiresAt < Date.now()) {
            await OTP.deleteOne({ email });
            throw Error("Code has expired. Please request again.");
        }

        return matchedOTPRecord.otp;
    } catch (error) {
        throw error;
    }
};

const sendOTP = async ({ email, subject, message }) => {
    try {
        if (!(email && subject && message)) {
            throw Error("Provide values for email, subject, message");
        }

        // clear old record
        await OTP.deleteOne({ email });

        // generate OTP
        const generatedOTP = await generateOTP();

        // send email
        const mailOptions = {
            from: AUTH_EMAIL,
            to: email,
            subject,
            html: `<p>${message}</p><p style="color:#92A3FD;
                    font-size:25px;letter-spacing:2px;"><b>${generatedOTP}</b></p><p>This code <b>expires</b> in 1 hour</p>`,
        };
        await sendEmail(mailOptions);

        // save otp record
        const newOTP = await new OTP({
            email,
            otp: generatedOTP
        });

        const createOTPRecord = await newOTP.save();
        return createOTPRecord;
    } catch (error) {
        throw error;
    }
};

const deleteOTP = async (email) => {
    try {
        await OTP.deleteOne({ email });
    } catch (error) {
        throw error;
    }
}



module.exports = { sendOTP, verifyOTP, deleteOTP };