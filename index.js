
//import
const express               = require('express');
const mongoose              = require('mongoose');                  // database connection
const bcrypt                = require('bcrypt');                    // encrpyting password
const session               = require('express-session');           // session storage
const multer                = require('multer');                    // uploading files
const { v4: uuidv4 }        = require('uuid');                      // universal unique identifier
const methodOverride        = require('method-override');           // override form method request
const path                  = require('path');

//Models
const Details               = require('./models/car-details');      // Car Details Model
const Users                 = require('./models/user-details');     // Users Model
const Comment               = require('./models/comment-section');  // Comment Model

//execute
const app                   = express();
const port                  = 3000;


//FILE FORMATS
app.use(express.json())                                             // for parsing application/json
app.use(express.urlencoded({ extended: true }))                     // for parsing application/x-www-form-urlencoded
app.use(methodOverride('_method'));                                 // variable to override method

//EJS TEMPLATE
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//IMPORT FILES FROM PUBLIC DIRECTORY
app.use(express.static(path.join(__dirname, '/public')));           // accessible even outside templating directory

//MONGOOSE CONNECTION
mongoose.connect('mongodb://localhost:27017/cHarLs')
    .then(() => {
        console.log("Connection Open");
    })
    .catch(err => {
        console.log("Error");
        console.log(err);
    })

//SET MULTER
const storage = multer.diskStorage({
    destination: './public/images',
    filename: function(req, file, cb){
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10000000
    },
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('car-img')                                                 //single: one file upload   $  car-img: name of input file

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png/                                 //allowed extensions
    const extname   = filetypes.test(path.extname(file.originalname).toLowerCase()); //check file extension
    const mimetype  = filetypes.test(file.mimetype);                //check mimetype

    if(extname && mimetype){
        return cb(null, true);
    }else{
        cb('Error: Invalid File Extension')
    }
}

//SESSION
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false
}))

app.use(function(req, res, next) {
    res.locals.user = req.session.username;
    res.locals.cartype = "All";                                       // default car type in filter by category
    res.locals.carbrand = "All";                                      // default car brand in filter by category
    res.locals.carcolor = "All";                                      // default car color in filter by category
    next();
});

//check if user is logged in, prohibit to access page if not = redirect to login page
function isLoggedIn (req, res, next) {
    if(req.session.username){
        return next()
    }
    res.redirect('/login');
}

//check if user is logged out, prohibit to access page if not = redirect to home page
function isLoggedOut (req, res, next) {
    if(!req.session.username){
        return next()
    }
    res.redirect('/')
}

//ARRAY FOR CAR CATEGORIES
const types = ["Sedan", "Hatchback", "Pickup", "SUV", "Sport Car"];
const brands = ["Toyota", "Tesla", "Honda", "Mercedes", "Hyundai", "BMW"];
const colors = ["Black", "Red", "Blue", "Orange", "White"];

//ROUTES
//HOME PAGE
app.get('/', (req, res) =>{
    res.render('home');
})
//DISPLAY ALL LIST
app.get('/find', async (req, res) =>{
    const carDetails = await Details.find({});
    res.render('find', {carDetails, types, brands, colors});
})
//DISPLAY BY CATEGORY
app.get('/find/filter-list', async (req, res) =>{
    const carType = req.query.Type;
    const carBrand = req.query.Brand;
    const carColor = req.query.Color;
    res.locals.cartype = carType;
    res.locals.carbrand = carBrand;
    res.locals.carcolor = carColor;
    //conditions for filtering categories
    if(carType === "All"){
        if(carBrand === "All" && carColor !== "All"){                                          //if type and brand is set to all
            const carDetails = await Details.find({Color: carColor});
            return res.render('find', {carDetails, types, brands, colors});
        }else if(carBrand !== "All" && carColor === "All"){                                    //if type and color is set to all
            const carDetails = await Details.find({Brand: carBrand});
            return res.render('find', {carDetails, types, brands, colors});
        }else if(carBrand !== "All" && carColor !== "All"){                                    //if only type is set to all
            const carDetails = await Details.find({Brand: carBrand, Color: carColor});
            return res.render('find', {carDetails, types, brands, colors});
        }else{                                                                                 //if all category is set to all
            return res.redirect('/find');
        }
    }else if(carBrand === "All"){
        if(carType !== "All" && carColor === "All"){                                           //if brand and color is set to all
            const carDetails = await Details.find({Type: carType});                            
            return res.render('find', {carDetails, types, brands, colors});
        }else{                                                                                 //if only brand is set to all
            const carDetails = await Details.find({Type: carType, Color: carColor}); 
            return res.render('find', {carDetails, types, brands, colors});
        }
    } else if(carColor === "All"){                                                             //if only color is set to all
        const carDetails = await Details.find({Type: carType, Brand: carBrand}); 
        return res.render('find', {carDetails, types, brands, colors});
    }

    const carDetails = await Details.find({Type: carType, Brand: carBrand, Color: carColor});  //if no category is set to all
    return res.render('find', {carDetails, types, brands, colors});
})
//SUBREDDIT: EVERY CAR LISTED
app.get('/find/cars/:id', async (req, res) =>{
    const {id} = req.params;
    const carDetails = await Details.findById(id);

    //Populate Schema to get the comments in each listing
    await Details.findById(id).populate('Comments').exec(function(err, com){
        if (err) return handleError(err);
        res.render('carDetails', {carDetails,com});
    })
    // res.render('carDetails', {carDetails,comments});
})

//COMMENTS
app.post('/find/cars/:id/comment', async (req, res) => {
        // find out which post you are commenting
    const id = req.params.id;
        // get the comment text and record post id
    const comment = new Comment({
        author: req.body.author,
        text: req.body.comment,
        post: id
    })
    // save comment
    await comment.save();
        // get this particular post
    const postRelated = await Details.findById(id);
        // push the comment into the post.Comments array
    postRelated.Comments.push(comment);
        // save and redirect...
    await postRelated.save(function(err) {
        if(err) {
            console.log(err)
        }   
        res.redirect(`/find/cars/${postRelated._id}`)
    })

})

//SIGN UP
app.get('/signup', isLoggedOut, (req, res) =>{
    res.render('signup');
})

app.post('/creating-account', async (req, res) =>{
    // const newUser = new Users(req.body);
    // await newUser.save();
    // res.redirect('/login');
    const hashedPassword = await bcrypt.hash(req.body.password,10);
    const newUser = new Users({
        fName: req.body.fName,
        lName: req.body.lName,
        userName: req.body.userName,
        password: hashedPassword,
    })
    await newUser.save();
    res.redirect('/login');
})

//LOGIN
app.get('/login', isLoggedOut, (req, res) =>{
    res.render('login');
})

//SIGNING IN
app.get('/signIn', async (req, res) =>{
    const user = await Users.findOneAndUpdate({userName: req.query.userName}, {isLoggedIn: true}, {new: true});
    req.session.username = user; //pass user to session
    res.redirect('/find');
})

//CHECK IF USERNAME IS ALREADY EXISTS
app.get('/user-check', (req, res) =>{
    Users.findOne({userName: req.query.userName}  , function(err, Users){
        if(err) {
          console.log(err);
        }
        var message;
        if(Users) {
            // console.log(Users)
            message = "user exists";
            //console.log(message)
        } else {
            message= "user doesn't exist";
            // console.log(message)
        }
        res.json({message: message});
    });
})

//CHECK IF USERNAME EXISTS AND PASSWORD IS CORRECT
app.get('/find-user', (req, res) =>{
     Users.findOne({userName: req.query.userName}  , async function(err, Users){
        if(err) {
          console.log(err);
        }
        var message;
        if(Users) {
            const isMatch = await bcrypt.compare(req.query.password, Users.password);  //(plainText, hashedPassword)
            if(isMatch){
                message = 'correct';
            }
            else{
                message = 'incorrect password';
            }
        } else {
            message= "invalid username";
        }
        res.json({message: message});
    });
})

//SIGN OUT ACCOUNT
app.get('/signOut', async (req, res) =>{
    req.session.destroy(); //destroy session
    res.redirect('/login');
})

//FORM TO CREATE NEW LIST
app.get('/create-new-list', isLoggedIn, (req, res) =>{
    res.render('newList', {types, brands, colors});
})

//INSERT LIST
app.post('/adding-new-list', async (req, res) =>{
    upload (req, res, async (err) => {
        if(err){
            res.render('newList', {types, brands, colors, msg: err});
        }else{
            if(req.file == undefined){
                res.render('newList', {types, brands, colors, msg: 'Error: No file selected'});
            }else{
                const newDetails = new Details({
                    FileName: req.file.filename,
                    UploadBy: req.body.UploadBy,
                    ListName: req.body.ListName,
                    Address: req.body.Address,
                    Description: req.body.Description,
                    Type: req.body.Type,
                    Brand: req.body.Brand,
                    Color: req.body.Color,
                });
                await newDetails.save();
                res.redirect(`/find/cars/${newDetails._id}`);
            }
        }
    })
    // const newDetails = new Details(req.body);
    // await newDetails.save();
    // res.redirect(`/find/cars/${newDetails._id}`);
})

//DELETE LIST
app.delete('/find/cars/:id', async (req, res) => {
    const {id} = req.params;
    const deleteList = await Details.findByIdAndDelete(id);
    res.redirect('/find');
})

//FORM TO EDIT LIST
app.get('/edit-car-details/:id', isLoggedIn, async (req, res) => {
    const {id} = req.params;
    const carDetails = await Details.findById(id);
    res.render('edit',{carDetails, types, brands, colors});
})

//EDIT LIST
app.put('/edit-car-details/:id', async (req, res) => {
    upload (req, res, async (err) => {
        const {id} = req.params;
        const carDetails = await Details.findById(id);
        if(err){
            res.render('edit', {carDetails, types, brands, colors, msg: err});
        }else{
            if(req.file == undefined){
                const car = await Details.findByIdAndUpdate(id, {
                    UploadBy: req.body.UploadBy,
                    ListName: req.body.ListName,
                    Address: req.body.Address,
                    Description: req.body.Description,
                    Type: req.body.Type,
                    Brand: req.body.Brand,
                    Color: req.body.Color,
                }, {runValidators: true, new: true});
                res.redirect(`/find/cars/${car._id}`);
            }else{
                const car = await Details.findByIdAndUpdate(id, {
                    FileName: req.file.filename,
                    UploadBy: req.body.UploadBy,
                    ListName: req.body.ListName,
                    Address: req.body.Address,
                    Description: req.body.Description,
                    Type: req.body.Type,
                    Brand: req.body.Brand,
                    Color: req.body.Color,
                }, {runValidators: true, new: true});
                res.redirect(`/find/cars/${car._id}`);
            }
        }
    })
    // const {id} = req.params;
    // const car = await Details.findByIdAndUpdate(id, req.body, {runValidators: true, new: true});
    // res.redirect(`/find/cars/${car._id}`);
})

//ABOUT PAGE
app.get('/about', (req, res) => {
    res.render('about')
})


app.get('*', (req, res) => {
    res.send('404: Page not found! Try to explore other part of website')
});

app.listen(port, () => {
    console.log('listening on port 3000');
})