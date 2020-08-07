import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
//import { json } from 'body-parser';

const Index = function({user}) {

    const [books, setBooks] = useState([]);
    
    useEffect(() => {
        (async () => {
            await getBooks();
        })();
    }, []);

    const getBooks = async () => {
        const booksResp = await Axios.get('/api/books');
        if (booksResp.status === 200){
            setBooks(booksResp.data);
        };
      
    };

    const deleteBook = async book => {
        try{
            const resp = await Axios.post('/api/books/delete', {
                id: book._id
            });
            if (resp.status === 200) toast("The book was deleted successfully", {type: toast.TYPE.SUCCESS})
            ;
          await getBooks();
        } catch(error){
            toast("There was an error deleting the book",
            {type: toast.TYPE.ERROR});
        }
    };
    
    return (
        <Container className="my-5">
            <header>
                <h1>Book Archive</h1>
            </header>
            
            <hr />
            
            <div className="content">
                {books && books.map((book, i) => (
                    //because react is very specific about unique contents, therefore these cards we are creating
                    //in order to make them unique , we add key={i}
              
                    <div key={i} className="card my-3">
                        <div className="card-header clearfix">
                        <img className="card-img-top" src="../coming.jpg" alt="Card image cap" />
                            <div className="float-left">
                                <h5 className="card-title">
                                    {book.title}
                                </h5>
                                <small>{book.user.fullname}</small> 
                            </div>
                            <div className="float-right">
                                UpdatedAt:<small> {book.updatedAt.toLocaleString()}</small>
                            </div>
                    </div>
                   

                    <div className="card-body">
                        <p className="card-text">
                            Book with the title:<strong>{book.title}</strong> is written by 
                            author:<strong> {book.user.firstName} {book.user.lastName}</strong>. This book has
                            <strong> {book.length}</strong> pages. The price of hardcover is: 
                             <strong> {book.price} </strong> dollars.
                        </p>
                    </div>

                    
                    {user._id === book.user._id ? (
                        <div className="card-footer">
                            <Link to={{
                                pathname: "/books/edit",
                                state: {
                                    id: book._id
                                }
                            }}>
                                <i className="fa fa-edit"></i>
                            </Link>
                            
                            <button type="button" onClick={() =>
                                deleteBook(book)}>
                                    <i className="fa fa-trash"></i>
                            </button>
                        </div>
                    ) : null}

                 </div>
                ))}
            </div>
        </Container>
    );
};

export default Index;