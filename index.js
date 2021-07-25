const express = require("express");
const app = express();
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const bcrypt = require('bcrypt');

const sessionConfig = {
    secret: 'thisisasecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());


const methodOverride = require('method-override')
app.use(methodOverride('_method'))

const admin = require('./models/admin');
const staff = require('./models/staff');
const student = require('./models/student');
const feedback = require('./models/feedback');

const mongoose = require('mongoose');

//Enter your database name in the line below, for Db models check the models folder
mongoose.connect('mongodb://localhost:27017/attendancesys', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("connected");
});

app.set("view engine", "ejs");
app.set('views', path.join(__dirname,'/views'));


app.use(express.static('assets'));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.use(function (req, res, next) {
    res.locals.user = req.session.user;
    next();
});

const requireLogin = (req, res, next) => {
    if (!req.session.user_id){
        return res.redirect('/')
    }
    next();
}


app.post('/login', async (req, res) => {
    

 const {name , password} = req.body;
 console.log(name , password);
 const user = await admin.findOne({ name });
 var validpassword = false;
 const user1 = await staff.findOne({ name });
 var validpassword1 = false;
 const user2 = await student.findOne({ name });
 var validpassword2 = false;

    

    if(user){
        if(await bcrypt.compare(password, user.password)){
            validpassword = true;
        }
    }
    else if (user1) {
        if (await bcrypt.compare(password, user1.password)) {
            validpassword1 = true;
        }
    }
    else if (user2) {
        if (await bcrypt.compare(password, user2.password)) {
            validpassword2 = true;
        }
    }

//  const validpassword = await bcrypt.compare(password, user.password)
//  const user1 = await staff.findOne({ name });
//  const validpassword1 = await bcrypt.compare(password, user1.password)
//  const user2 = await student.findOne({ name });
//  const validpassword2 = await bcrypt.compare(password, user2.password)
 if(validpassword === true) {
     req.session.user_id = user._id;
     res.redirect('/admin');
 }
 else if(validpassword1 === true) {
     req.session.user_id = user1._id;
     res.redirect('/staff');
 }
 else if(validpassword2 === true) {
     req.session.user_id = user2._id;
     res.redirect('/student');
 }
 else {
     res.send('user does not exist');
 }

//  if( username =="Jayesh" && password == "1234"){
//      res.redirect('/admin');
//  }

//  else if (username == "Aditi" && password == "1234") {
//      res.redirect('/student');
//  }

//  else if (username == "Rishi" && password == "1234") {
//      res.redirect('/staff');
//  }

});




app.get("/",(req, res) => {
    res.render('login.ejs');
    
})
app.get("/forgotpassword", (req, res) => {
    res.render('forgotpassword.ejs');

})

app.get("/admin", requireLogin, async (req, res) => {
    var user = req.session.user_id
    const currentadmin = await admin.findOne({ _id: user })
    console.log(currentadmin);
    console.log("admin module successfull")
    { res.render('admin.ejs',{currentadmin});}

})

app.get("/staff", requireLogin, async (req, res) => {
    var user = req.session.user_id
    const currentstaff = await staff.findOne({ _id: user })
    console.log(currentstaff);
     { res.render('staff.ejs',{currentstaff}); }

})

app.get("/student", requireLogin, async (req, res) => {
    var user = req.session.user_id
    const currentstudent = await student.findOne({ _id: user })
    console.log(currentstudent);
    { res.render('student.ejs',{currentstudent}); }

})

app.get("/feedbackstaff", requireLogin, async (req, res) => {
    var user = req.session.user_id
    const currentstaff = await staff.findOne({ _id: user })
    { res.render('feedbackstaff.ejs', { currentstaff }); }

})

app.get("/feedbackstudent", requireLogin, async (req, res) => {
    var user = req.session.user_id
    const currentstudent = await student.findOne({ _id: user })
    { res.render('feedbackstudent.ejs', { currentstudent }); }

})

app.post('/feedbackstudent', requireLogin, async (req, res) => {
    const { name, inpt } = req.body;
    const newFeedback = new feedback({ name, inpt })
    await newFeedback.save();
    res.redirect('/student/')
})

app.post('/feedbackstaff', requireLogin, async (req, res) => {
    const { name, inpt } = req.body;
    const newFeedback = new feedback({ name, inpt })
    await newFeedback.save();
    res.redirect('/staff/')
})


app.get("/viewattendance", requireLogin, async (req, res) => {
    var user = req.session.user_id
    const currentstudent = await student.findOne({ _id: user })
    const attendance = currentstudent.attendance
    res.render('viewattendance.ejs', { currentstudent, attendance}); 

})

app.get('/takeattendance', requireLogin, async (req, res) => {
    const students = await student.find({})
    res.render('takeattendance.ejs', { students });
})

app.post('/takeattendance', requireLogin, (req, res) => {
    const {id} = req.body;
    var ids = id;
    const {sub} = req.body;
    var created = new Date()
    var isabsent = false;
    
    student.find().exec(function (err, doc) {
        doc.forEach(function (item) {
             for (var z = 0; z <= ids.length; z++) {
                if (item.id == ids[z]) {
                    student.findByIdAndUpdate(
                    item.id,
                    { $push: { "attendance": { sub: sub, status: "present", when: created } } },
                    { safe: true, upsert: true, new: true },
                    function (err, model) {
                    console.log(err);
                     })
                    ids.shift();
                    break;
                    // console.log(item.id);
                    // console.log(ids[z])
                    // console.log("matched and present")
                    // console.log(err);
                 }
                else {
                    isabsent = true;
                    // console.log(item.id, "no")
                }               
                }
            if (isabsent == true) {
                student.findByIdAndUpdate(
                    item.id,
                    { $push: { "attendance": { sub: sub, status: "absent", when: created } } },
                    { safe: true, upsert: true, new: true },
                    function (err, model) {
                        console.log(err);
                    })
                isabsent = false;

            }  
        })
        
    });
    res.redirect('/staff/')
})

app.get('/test', requireLogin, async (req, res) => {
    var user = req.session.user_id
    const currentstudent = await student.findOne({ _id: user })
    { res.render('test.ejs', { currentstudent }); }

})

app.put('/test/:id' , requireLogin, async (req, res) => {
    const { id } = req.params;
    const {sub , status} = req.body;
    const created = new Date()
    console.log(id);

    student.findByIdAndUpdate(
        id,
        { $push: { "attendance": { sub: sub, status: status, when: created} } },
        { safe: true, upsert: true, new: true },
        function (err, model) {
            console.log(err);
        }
    );
    
})

// app.get('/test/:id', requireLogin, async (req, res) => {
//     const { id } = req.params;
//     const idstudent = await student.findById(id)
//     console.log(idstudent);
//     res.render('test.ejs', { idstudent });
// })

app.get('/viewadmin', requireLogin, async (req, res) => {
    const admins = await admin.find({})
    console.log(admins);
    res.render('viewadmin.ejs' , {admins});
})

app.get('/viewstaff', requireLogin, async (req, res) => {
    const staffs = await staff.find({})
    console.log(staffs);
    res.render('viewstaff.ejs', { staffs });
})

app.get('/viewstudent', requireLogin, async (req, res) => {
    const students = await student.find({})
    console.log(students);
    res.render('viewstudent.ejs', { students });
})

app.get('/viewfeedback', requireLogin, async (req, res) => {
    const feedbacks = await feedback.find({})
    res.render('viewfeedback.ejs', { feedbacks });
})

app.get('/viewadmin/:id', requireLogin, async (req, res) => {
    const{ id } = req.params;
    const idadmin = await admin.findById(id)
    console.log(idadmin);
    res.render('show.ejs', {idadmin});
})

app.get('/viewstaff/:id', requireLogin, async (req, res) => {
    const { id } = req.params;
    const idstaff = await staff.findById(id)
    console.log(idstaff);
    res.render('showstaff.ejs', { idstaff });
})

app.get('/viewstudent/:id', requireLogin, async (req, res) => {
    const { id } = req.params;
    const idstudent = await student.findById(id)
    const attendance = idstudent.attendance
    res.render('showstudent.ejs', { idstudent , attendance});
})

app.get('/newadmin', requireLogin,  (req, res) => {
    res.render('newadmin.ejs')
})

app.get('/newstaff', requireLogin,  (req, res) => {
    res.render('newstaff.ejs')
})

app.get('/newstudent', requireLogin,  (req, res) => {
    res.render('newstudent.ejs')
})

app.get('/subject', requireLogin, (req, res) => {
    res.render('subject.ejs')
})




app.post('/viewadmin', requireLogin,  async (req, res) => {
    const {name, age, gender, phoneNo, email, password} = req.body;
    const hash = await bcrypt.hash(password, 12)
    const newAdmin =  new admin({name, age, gender, phoneNo, email, password: hash})
    await newAdmin.save();
    res.redirect('/viewadmin/')
})

app.post('/viewstaff', requireLogin,  async (req, res) => {
    const { name, age, course, gender, phoneNo, email, password } = req.body;
    const hash = await bcrypt.hash(password, 12)
    const newStaff = new staff({ name, age, course, gender, phoneNo, email, password: hash })
    await newStaff.save();
    res.redirect('/viewstaff/')
})

app.post('/viewstudent', requireLogin,  async (req, res) => {
    const { name, age, gender, rollno, year, division, course, phoneNo, email, password } = req.body;
    const hash = await bcrypt.hash(password, 12)
    const newStudent = new student({ name, age, gender, rollno, year, division, course, phoneNo, email, password: hash})
    await newStudent.save();
    res.redirect('/viewstudent/')
})

app.get('/viewadmin/:id/edit', requireLogin,  async (req, res) => {
    const { id } = req.params;
    const idadmin = await admin.findById(id)
    res.render('edit.ejs' , {idadmin})
})

app.get('/viewstaff/:id/edit', requireLogin,  async (req, res) => {
    const { id } = req.params;
    const idstaff = await staff.findById(id)
    res.render('editstaff.ejs', { idstaff })
})

app.get('/viewstaff/:id/edit2', requireLogin, async (req, res) => {
    const { id } = req.params;
    const idstaff = await staff.findById(id)
    res.render('editstaff2.ejs', { idstaff })
})


app.get('/viewstudent/:id/edit', requireLogin,  async (req, res) => {
    const { id } = req.params;
    const idstudent = await student.findById(id)
    res.render('editstudent.ejs', { idstudent })
})

app.get('/viewstudent/:id/edit2', requireLogin, async (req, res) => {
    const { id } = req.params;
    const idstudent = await student.findById(id)
    res.render('editstudent2.ejs', { idstudent })
})

app.put('/viewadmin/:id', requireLogin,  async (req, res) => {
    const { id } = req.params;
    const { name, age, gender, phoneNo, email, password } = req.body;
    const hash = await bcrypt.hash(password, 12)
    const idadmin = await admin.findByIdAndUpdate(id, { name, age, gender, phoneNo, email, password: hash }, { runValidators: true, new: true, useFindAndModify: true});
    res.redirect(`/viewadmin/${idadmin._id}`);
})

app.put('/viewstaff/:id', requireLogin,  async (req, res) => {
    const { id } = req.params;
    const { name, age, course, gender, phoneNo, email, password } = req.body;
    const hash = await bcrypt.hash(password, 12)
    const idstaff = await staff.findByIdAndUpdate(id, {name , age , course, gender, phoneNo ,email , password: hash}, { runValidators: true, new: true, useFindAndModify: true });
    res.redirect(`/viewstaff/${idstaff._id}`);
})

app.put('/viewstudent/:id', requireLogin,  async (req, res) => {
    const { id } = req.params;
    const { name, age, gender, rollno, year, division, course, phoneNo, email, password } = req.body;
    const hash = await bcrypt.hash(password, 12)
    const idstudent = await student.findByIdAndUpdate(id, { name, age, gender, rollno, year, division, course, phoneNo, email, password: hash}, { runValidators: true, new: true, useFindAndModify: true });
    res.redirect(`/viewstudent/${idstudent._id }`);
})


app.delete('/viewadmin/:id', requireLogin,  async (req,res) => {
    const { id } = req.params;
    const deletedadmin = await admin.findByIdAndDelete(id)
    res.redirect('/viewadmin/')
})

app.delete('/viewstaff/:id', requireLogin,  async (req, res) => {
    const { id } = req.params;
    const deletedstaff = await staff.findByIdAndDelete(id)
    res.redirect('/viewstaff/')
})

app.delete('/viewstudent/:id', requireLogin,  async (req, res) => {
    const { id } = req.params;
    const deletedstudent = await student.findByIdAndDelete(id)
    res.redirect('/viewstudent/')
})

app.post('/logout', (req, res) => {
    // req.session.user_id = null;
    req.session.destroy()
    res.redirect('/')
})

app.listen(3030, () => {
    console.log("Listening on port 3030");
})
