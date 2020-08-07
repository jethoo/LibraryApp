const User = require('../models/User');
const viewPath = 'users';

exports.new = (req, res) => {
  res.render(`${viewPath}/new`, {
    pageTitle: 'New User'
  });
};

exports.create = async (req, res) => {
//const userDetails = req.body;
//req.session.flash = {};
  
  try {
    // Step 1: Create the new user and register them with Passport
    const user = new User(req.body);
    await User.register(user, req.body.password);
    
    return res.status(200).json({message:"User created"});
  } catch (error) {
    return res.status(401).json({message:"creation failed"});
  }
};