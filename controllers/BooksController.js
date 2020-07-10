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

exports.index = async (req,res) => {
     try{
       const books = await Books
       .find()
       .populate('user')
       .sort({updatedAt: 'desc'});
       console.log(books.firstName);
       res.render(`${viewPath}/index`,{
           pageTitle: 'Archive',
           books: books
       });
     } catch(error){
        req.flash('danger',`There was an error displaying the archive: ${error}`);
        res.redirect('/');
     }
};

exports.show = async (req,res) => {
  try{
      const books = await Books.findById(req.params.id)
         .populate('user'); //name of the model , 'user' is passed in populate
      //need to populate the user , to check the user is part of it
     
      res.render(`${viewPath}/show`, {
          pageTitle: books.title,
          books: books
      });
  } catch (error){
      req.flash('danger', `There was an error displaying this 
      book: ${error}`);
      res.redirect('/');
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
    req.flash('success', 'Book created successfully');
    res.redirect(`/books/${book.id}`);
  }catch(error){
    req.flash('danger', `There was an error creating the book: ${error}`);
    req.session.formData = req.body;
    res.redirect('/books/new');
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
    const {user:email} = req.session.passport;
    const user = await User.findOne({email:email});

    let book = await Books.findById(req.body.id);
    if (!book) throw new Error('Book could not be found');

    const attributes = {user: user._id, ...req.body};
    await Books.validate(attributes);
    await Books.findByIdAndUpdate(attributes.id, attributes);

    req.flash('success','The blog was updated successfully');
    res.redirect(`/books/${req.body.id}`);
  }
  catch(error){
    req.flash('danger', `There was an error updating this book: ${error}`);
    res.redirect(`/books/${req.body.id}/edit`);
  }
};

exports.delete = async (req,res) => {
  try{
    await Books.deleteOne({_id: req.body.id});
    req.flash('success', 'Book was deleted successfully');
    res.redirect(`/books`);
}
catch{
    req.flash('danger', `There was an error deleting this 
    book: ${error}`);
    res.redirect(`/books`);
}
};