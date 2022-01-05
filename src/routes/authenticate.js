const express = require("express");
const router = express.Router();
const db = require("../db/db");
var crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');


var user;
router.post("/saveTeacherList", (req, res, next) => {
    var salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';
    var repass = salt + '' + req.body.password;
    var encPassword = crypto.createHash('sha1').update(repass).digest('hex');
    // console.log(encPassword);
    console.log(req.body);
    db.executeSql("INSERT INTO`users`(`email`, `password`, `role`, `isactive`)VALUES('" + req.body.email + "','" + encPassword + "','Teacher',true)", function (data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            console.log(data.insertId)
            db.executeSql("INSERT INTO `teacherlist`(`firstname`,`lastname`,`qualification`,`contact`,`whatsapp`,`email`,`password`,`address`,`gender`,`uid`)VALUES('" + req.body.firstname + "','" + req.body.lastname + "','" + req.body.qualification + "','" + req.body.contact + "','" + req.body.Whatsapp + "','" + req.body.email + "','" + encPassword + "','" + req.body.address + "','" + req.body.gender + "'," + data.insertId +");", function (data1, err) {
                if (err) {
                    console.log(err);

                } else {

                    for (let i = 0; i < req.body.rights.length; i++) {
                        for (let j = 0; j < req.body.rights[i].selsubjects.length; j++) {
                            db.executeSql("INSERT INTO `subrightstoteacher`(`teacherid`, `stdid`, `subid`, `updateddate`) VALUES (" + data1.insertId + "," + req.body.rights[i].stdid + "," + req.body.rights[i].selsubjects[j].subid + ",null)", function (data2, err) {
                                if (err) {
                                    console.log(err);
                                }
                                else { }
                            })
                        }
                    }
                    res.json("success");
                    // return res.json(data);
                }
            });

        }
    });
});



router.post("/SaveStudentList", (req, res, next) => {
    var salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';
    var repass = salt + '' + req.body.password;
    var encPassword = crypto.createHash('sha1').update(repass).digest('hex');
    var prepass = salt + '' + req.body.parentsPwd;
    var encParentsPassword = crypto.createHash('sha1').update(prepass).digest('hex');
    db.executeSql("INSERT INTO`users`(`email`, `password`, `role`, `isactive`)VALUES('" + req.body.email + "','" + encPassword + "','Student',true)", function (datau, err) {
        if (err) {
            console.log(err)
        } else {
            console.log(datau.insertId);
            db.executeSql("INSERT INTO `studentlist`(`firstname`,`middlename`,`lastname`,`email`,`password`,`gender`,`dateofbirth`,`contact`,`parents`,`fname`, `mname`, `mnumber`, `pactive`, `mactive`, `cactive`, `batchtime`, `cmmitfee`,`address`,`city`,`pincode`,`standard`,`grnumber`,`transport`,`propic`,`schoolname`,`uid`)VALUES('" + req.body.firstname + "','" + req.body.middlename + "','" + req.body.lastname + "','" + req.body.email + "','" + encPassword + "','" + req.body.gender + "',CURRENT_TIMESTAMP," + req.body.contact + "," + req.body.parents + ",'" + req.body.fname + "','" + req.body.mname + "'," + req.body.mnumber + "," + req.body.pactive + "," + req.body.mactive + "," + req.body.cactive + ",'" + req.body.batchtime + "','" + req.body.cmmitfee + "','" + req.body.address + "','" + req.body.city + "'," + req.body.pincode + ",'" + req.body.standard + "','" + req.body.grnumber + "'," + req.body.transport + ",'" + req.body.profile + "','" + req.body.schoolname + "',"+datau.insertId+");", function (data, err) {
                if (err) {
                    console.log(err)
                } else {
                    console.log(data.insertId);
                    db.executeSql("INSERT INTO`users`(`email`, `password`, `role`, `isactive`)VALUES('" + req.body.parentsEmail + "','" + encPassword + "','Parents',true)", function (datap, err) {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log(datap.insertId)
                            db.executeSql("INSERT INTO `parentsinfo`(`stuid`,`fname`,`mname`,`email`,`password`,`fnumber`,`mnumber`,`role`,`createddate`,`uid`)VALUES(" + data.insertId + ",'" + req.body.fname + "','" + req.body.mname + "','" + req.body.parentsEmail + "','" + encParentsPassword + "','" + req.body.parents + "','" + req.body.mnumber + "','Parents',CURRENT_TIMESTAMP,"+datap.insertId+");", function (data1, err) {
                                if (err) {
                                    console.log(err)
                                } else {
                                    res.json("success");
                                }
                            });
                        }
                    });
                    
                }
            });
        }
    });
    

});

router.post("/SaveVisitorDetails", (req, res, next) => {
    let visitotp = Math.floor(100000 + Math.random() * 900000);
    var salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';
    var repass = salt + '' + req.body.password;
    var encPassword = crypto.createHash('sha1').update(repass).digest('hex');
    db.executeSql("INSERT INTO `users`(`email`, `password`, `role`, `isactive`)VALUES('" + req.body.email + "','" + encPassword + "','Visitor',true)", function (datau, err) {
        if (err) {
            console.log(err)
        } else {
            db.executeSql("INSERT INTO `visitorreg`(`firstname`,`lastname`,`email`,`password`,`contact`,`createddate`,`isactive`,`detailsupdated``uid`) VALUES ('" + req.body.firstname + "','" + req.body.lastname + "','" + req.body.email + "','" + encPassword + "'," + req.body.contact + ",CURRENT_TIMESTAMP,false,false,"+datau.insertId+")", function (data, err) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(req.body);
                    db.executeSql("INSERT INTO `visitorotp`(`vid`, `otp`, `createddate`, `createdtime`,`isactive`) VALUES (" + data.insertId + "," + visitotp + ",CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,true)", function (data1, err) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            const transporter = nodemailer.createTransport({
                                service: 'gmail',
                                host: "smtp.gmail.com",
                                port: 465,
                                secure: false, // true for 465, false for other ports
                                auth: {
                                    user: 'keryaritsolutions@gmail.com', // generated ethereal user
                                    pass: 'sHAIL@2210', // generated ethereal password
                                },
                            });
                            const output = `
                                <h3>One Time Password</h3>
                                <p>To authenticate, please use the following One Time Password(OTP):<h3>`+ visitotp + `</h3></p>
                                <p>OTP valid for only 2 Minutes.</P>
                                <p>Don't share this OTP with anyone.</p>
                                <a href="http://localhost:4200/password">Change Password</a>
        `;
                            const mailOptions = {
                                from: '"KerYar" <keryaritsolutions@gmail.com>',
                                subject: "One Time Password",
                                to: req.body.email,
                                Name: '',
                                html: output
        
                            };
                            transporter.sendMail(mailOptions, function (error, info) {
                                console.log('fgfjfj')
                                if (error) {
                                    console.log(error);
                                    res.json("Errror");
                                } else {
                                    console.log('Email sent: ' + info.response);
                                    data.email = req.body.email;
                                    data.password = req.body.password;
                                    data.username = req.body.firstname + ' ' + req.body.lastname;
                                    res.json(data);
                                }
                            });
                        }
                    })
                }
            })
        }
    });
 

});

router.post("/GetOtpVisitorURL", (req, res, next) => {
    console.log(req.body)
    db.executeSql("select * from visitorotp where vid = '" + req.body.visitorId + "' and otp = " + req.body.visitorOtp + " ", function (data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            const body = req.body;
            console.log(body);
            var salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';
            var repass = salt + '' + body.password;
            var encPassword = crypto.createHash('sha1').update(repass).digest('hex');

            db.executeSql("select * from visitorreg where email='" + req.body.email + "';", function (data, err) {
                console.log(data);
                if (data != null) {
                    db.executeSql("select * from visitorreg where email='" + req.body.email + "' and password='" + encPassword + "';", function (data, err) {
                        console.log(data);
                        if (data != null) {

                            module.exports.user = {
                                username: data[0].email, password: data[0].password
                            }
                            let token = jwt.sign({ username: data[0].email, password: data[0].password },
                                secret,
                                {
                                    expiresIn: '1h' // expires in 24 hours
                                }
                            );
                            console.log("token=", token);
                            data[0].token = token;

                            res.cookie('auth', token);

                            res.json(data);
                        }
                        else {
                            return res.json(2);
                        }
                    });
                }
                else {
                    return res.json(1);
                }
            });

            // return res.json(data);
        }
    });
});

let secret = 'prnv';
router.post('/UserLogin', (req, res, next) => {
    restart1();
    const body = req.body;
    console.log(body);
    var salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';
    var repass = salt + '' + body.password;
    var encPassword = crypto.createHash('sha1').update(repass).digest('hex');
    if (body.role == 'Teacher') {
        db.executeSql("select * from teacherlist where email='" + req.body.email + "';", function (data, err) {
            console.log(data);
            if (data.length != 0) {
                db.executeSql("select * from teacherlist where email='" + req.body.email + "' and password='" + encPassword + "';", function (data, err) {
                    console.log(data);
                    if (data.length > 0) {

                        module.exports.user = {
                            username: data[0].email, password: data[0].password
                        }
                        let token = jwt.sign({ username: data[0].email, password: data[0].password },
                            secret,
                            {
                                expiresIn: '1h' // expires in 24 hours
                            }
                        );
                        console.log("token=", token);
                        data[0].token = token;

                        res.cookie('auth', token);
                        res.json(data);
                    }
                    else {
                        return res.json(2);
                    }
                });
            }
            else {
                return res.json(1);
            }
        });
    }
    else {

        db.executeSql("select * from studentlist where email='" + req.body.email + "';", function (data, err) {

            if (data.length != 0) {
                db.executeSql("select * from studentlist where email='" + req.body.email + "' and password='" + encPassword + "';", function (data, err) {
                    // console.log(data);
                    if (data.length > 0) {
                        module.exports.user = {
                            username: data[0].email, password: data[0].password
                        }
                        let token = jwt.sign({ username: data[0].email, password: data[0].password },
                            secret,
                            {
                                expiresIn: '1h' // expires in 24 hours
                            }
                        );
                        console.log("token=", token);
                        data[0].token = token;

                        res.cookie('auth', token);
                        res.json(data);
                    }
                    else {
                        return res.json(2);
                    }
                });
            }
            else {

                db.executeSql("select * from visitorreg where email='" + req.body.email + "';", function (data, err) {
                    if (err) {
                        console.log(err)
                    }
                    else {

                        if (data.length != 0) {
                            db.executeSql("select * from visitorreg where email='" + req.body.email + "' and password='" + encPassword + "';", function (data, err) {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    console.log(data);
                                    if (data.length > 0) {
                                        module.exports.user = {
                                            username: data[0].email, password: data[0].password
                                        }
                                        let token = jwt.sign({ username: data[0].email, password: data[0].password },
                                            secret,
                                            {
                                                expiresIn: '1h' // expires in 24 hours
                                            }
                                        );
                                        console.log("token=", token);
                                        data[0].token = token;
                                        data[0].role = 'Visitor';


                                        res.cookie('auth', token);
                                        res.json(data);
                                    }
                                    else {
                                        return res.json(2);
                                    }
                                }

                            });
                        }
                        else {
                            return res.json(1);
                        }
                    }

                })
            }
        });
    }
});
function restart1() {
    setTimeout(function () {
        // When NodeJS exits
        console.log("restart ing");
        process.on("exit", function () {

            require("child_process").spawn(process.argv.shift(), process.argv, {
                cwd: process.cwd(),
                detached: true,
                stdio: "inherit"
            });
        });
        process.exit();
    }, 1000);
};



const auth = () => {
    return (req, res, next) => {
        next()
    }
}


module.exports = router;