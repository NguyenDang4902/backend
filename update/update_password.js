const express = require("express");
const router = express.Router();

const { hashData } = require("../util/hashedPassword");
const bcrypt = require("bcrypt");
const User = require("../user/model");

router.post("/", (req, res) => {
    try {
        let { email, oldPassword, newPassword } = req.body;
        oldPassword = oldPassword.trim();
        newPassword = newPassword.trim();

        if (oldPassword == "" || newPassword == "") {
            res.json({
                status: "FAILED",
                messsage: "Empty input field(s)!"
            });
        } else {
            // compare old password with database
            User.find({ email }).then(data => {
                if (data.length) {
                    const hashedPassword = data[0].password;
                    const hashedOldPassword = hashData(oldPassword);
                    bcrypt.compare(hashedOldPassword, hashedPassword).then(result => {
                        if (!result) {
                            res.json({
                                status: "FAILED",
                                messsage: "Old password you've entered is incorrect"
                            });
                        }
                    })
                }
            });
            if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/.test(newPassword)) {
                res.json({
                    status: "FAILED",
                    message: "Password must be 8-16 Characters including at least one uppercase letter, one lowercase letter, one special character and a number"
                })
            } else {
                const hashedNewPassword = hashData(newPassword);
                User.updateOne({ email }, { password: hashedNewPassword }).then(result => {
                    res.json({
                        status: "SUCCESS",
                        message: "PASSWORD UPDATED!"
                    })
                });
            }
        }
        return;
    } catch (error) {
        throw error;
    }
})

module.exports = router;