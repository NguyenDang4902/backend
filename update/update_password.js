const express = require("express");
const router = express.Router();

const { hashData } = require("../util/hashedPassword");
const bcrypt = require("bcrypt");
const User = require("../user/model");

router.post("/", async (req, res) => {
    try {
        let { email, oldPassword, newPassword } = req.body;
        if (oldPassword == "" || newPassword == "") {
            res.json({
                status: "FAILED",
                message: "Empty input field(s)!"
            })
        } else {
            hashedNewPassword = await hashData(newPassword);
            hashedOldPassword = await hashData(oldPassword);
            User.find({ email }).then(data => {
                if (data.length) {
                    const hashedPassword = data[0].password;
                    bcrypt.compare(hashedOldPassword, hashedPassword).then(result => {
                        if (result) {
                            User.updateOne({ email }, { password: hashedNewPassword }).then(result => {
                                res.json({
                                    status: "SUCCESS",
                                    message: "PASSWORD CHANGED!"
                                })
                            });
                        }
                        else {
                            res.json({
                                status: "SUCCESS",
                                message: "The password that you've entered is incorrect"
                                // message: "Wrong password. Try again or click Forgot your password to reset it"
                            })
                        }
                    })
                        .catch(err => {
                            res.json({
                                status: "FAILED",
                                message: "An error occurred while comparing password"
                            })
                        })
                }
            })

        }
    } catch (error) {
        throw error;
    }
})
module.exports = router;