const express = require("express");
const router = express.Router();

const User = require("../user/model");

router.post("/", (req, res) => {
    try {
        let { email, oldEmail, newEmail } = req.body;
        oldEmail = oldEmail.trim();
        newEmail = newEmail.trim();

        if (oldEmail == "" || newEmail == "") {
            res.json({
                status: "FAILED",
                messsage: "Empty input field(s)!"
            });
        } else if (email != oldEmail) {
            res.json({
                status: "FAILED",
                messsage: "Invalid old email entered!"
            });
        } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(newEmail)) {
            res.json({
                status: "FAILED",
                messsage: "Invalid new email entered!"
            });
        } else {
            User.updateOne({ email }, { email: newEmail }).then(result => {
                res.json({
                    status: "SUCCESS",
                    message: "EMAIL UPDATED!"
                })
            });
        }
        return;
    } catch (error) {
        throw error;
    }
})

module.exports = router;