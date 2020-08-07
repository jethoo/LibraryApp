// INSTRUCTIONS:
/*
  Create a new resource controller that uses the
  User as an associative collection (examples):
  - User -> Books
  - User -> Reservation

  The resource controller must contain the 7 resource actions:
  - index
  - show
  - new
  - create
  - edit
  - update
  - delete
*/
const viewPath = 'books';
const Books = require('../models/Books');
const User = require('../models/User');

const getUser = async req => {
  const { user: email } = req.session.passport;
  return await User.findOne({email: email});
}

exports.index = async (req,res) => {
     try{
       const books = await Books
       .find()
       .populate('user')
       .sort({updatedAt: 'desc'});
       
       res.status(200).json(books);
     } catch(error){
        res.status(400).json({message: 'There was an error fetching the books', error});
     }
};

exports.show = async (req,res) => {
  try{
      const books = await Books.findById(req.params.id)
         .populate('user'); //name of the model , 'user' is passed in populate
      //need to populate the user , to check the user is part of it
     res.status(200).json(books);
  } catch (error){
      res.status(400).json({message: "There was an error fetching the blog"});
  }
};

exports.new = (req,res) => {
  res.render(`${viewPath}/new`, {
      pageTitle: 'New Book'
  });
};

exports.create = async (req,res) => {
  try{
    
    const {user:email} = req.session.passport;
    const user = await User.findOne({email:email});
    const book = await Books.create({user: user._id, ...req.body});
    console.log("Book is :" + book);
    res.status(200).json({message:'The book was added successfully'});
  }catch(error){
    res.status(400).json({message:'There was an error added the book', error}); 
  }
};

exports.edit = async (req,res) => {
  try{
      const book = await Books.findById(req.params.id);
      res.render(`${viewPath}/edit`, {
          pageTitle: book.title,
          formData: book
      });
  }catch (error) {
      req.flash('danger', `There was an error accessing this 
      book: ${error}`);
      res.redirect('/');
  }
};

exports.update = async (req,res) => {
  try{
    
    const { user:email } = req.session.passport;
    const user = await User.findOne({email: email});
    
    //BLUNDER ERROR, I was passing "req.body.id " for finding the book, therefore i wasnot able to fetch the book
    //But in the body it is stored as _id !!
    //Because mongoose stores as _id 
    let book = await Books.findById(req.body._id);
    
    if (!book) throw new Error(`Book could not be found, ${JSON.stringify(req.body)}`);

    const attributes = {user: user._id, ...req.body};
    await Books.validate(attributes);
    await Books.findByIdAndUpdate(attributes._id, attributes);
   // await Books.findOneAndUpdate(attributes.id, attributes);
   // await Books.updateOne({_id:req.body.id, user: user._id}, {...req.body});
    console.log("Book is from Update controller"+ JSON.stringify(attributes));
    console.log("Book is from Update controller"+ JSON.stringify(attributes._id));
    res.status(200).json(book);
  } 
  catch(error){
    res.status(400).json({message: "There was an error updating the book"});
  }
};

exports.delete = async (req,res) => {
  try{

    await Books.deleteOne({_id: req.body.id});
    res.status(200).json({message: "Deleted."});
}
  catch{
    res.status(400).json({message: "There was an error deleting the book"});
  }
};