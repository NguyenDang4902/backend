const express = require("express");
const router = express.Router();

const User = require("../user/model");

router.post("/", (req, res) => {
    try {
        let { email, pic, gender, dob, weight, height } = req.body;
        pic = pic.trim();
        gender = gender.trim();
        dob = dob.trim();
        weight = weight.trim();
        height = height.trim();
        profile = {
            pic: pic,
            gender: gender,
            dob: dob,
            weight: weight,
            height: height
        };

        if (pic == "" || gender == "" || dob == "" || weight == "" || height == "") {
            res.json({
                status: "FAILED",
                messsage: "Empty input field(s)!"
            });
        } else if (weight <= 0) {
            res.json({
                status: "FAILED",
                message: "Invalid weight entered"
            })
        } else if (height <= 0) {
            res.json({
                status: "FAILED",
                message: "Invalid height entered"
            })
        } else {
            User.updateOne({ email }, { profile: profile }).then(result => {
                res.json({
                    status: "SUCCESS",
                    message: "UPDATED!"
                })
            });
        }
        return;
    } catch (error) {
        throw error;
    }
});

module.exports = router;