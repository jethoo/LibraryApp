// INSTRUCTIONS
/*
  Create a new resource model that uses the User
  as an associative collection (examples):
  - User -> Books
  - User -> Reservation

  Your model must contain at least three attributes
  other than the associated user and the timestamps.

  Your model must have at least one helpful virtual
  or query function. For example, you could have a
  book's details output in an easy format: book.format()
*/
const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
      },
      title: {
        type: String,
        required:true
      },
      length: {
        type: Number,
        required: true
      },
      price: {
        type: Number,
        required: true
      }
}, {
    timestamps: true
});

BookSchema.virtual('format')
  .get(function() {
      const book =  `Book with the title: <strong>${this.title}</strong> is written by author: <strong>${this.user.fullname}</strong>. 
      This book has <strong>${this.length}</strong> pages. 
      The price of hardcover is: <strong>${this.price}</strong> dollars.`;
      return book;
  });

  module.exports = mongoose.model('Book', BookSchema); 