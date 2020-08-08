import React, { useState, useEffect } from 'react';
import { Form, Container } from 'react-bootstrap';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';


const Edit = function (props){

    let history = useHistory();

    const id = props.location.state.id;

    const [inputs, setInputs] = useState({
        title: '',
        length: '',
        price: ''
    });

   // const [redirect, setRedirect ] = useState(false);

    useEffect(() => {
      (async () => {
          const bookResp = await Axios.get(`/api/books/${id}`);
          if(bookResp.status === 200 ) setInputs(bookResp.data);
      })()
  },[]);

    
    const handleSubmit = async event => {
        event.preventDefault();

        try {
            const resp = await Axios.post('/api/books/update', inputs);

            if(resp.status === 200){
                toast("The book was updated succcessfully", {
                    type: toast.TYPE.SUCCESS
                });
                history.push("/books");
            }
        } catch(error){
            toast("There was an issue updating the book", {
                type: toast.TYPE.ERROR
            });
        }
    };

    const handleInputChange = async event => {
        event.persist();

        const {name, value } = event.target;

        setInputs(inputs => ({
            ...inputs,
            [name]: value
        }));
    };

    return  (
        <Container className="my-5">
            <header>
                <h1>Edit Book</h1>
            </header>

            <hr/>

            <div>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Title:</Form.Label>
                        <Form.Control
                            name="title"
                            onChange={handleInputChange}
                            value={inputs.title}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Length:</Form.Label>
                        <Form.Control
                            name="length"
                            onChange={handleInputChange}
                            value={inputs.length}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Price:</Form.Label>
                        <Form.Control
                            name="price"
                            onChange={handleInputChange}
                            value={inputs.price}
                        />
                    </Form.Group>

                    <Form.Group>
                        <button type="submit" className="btn-primary">Update</button>
                    </Form.Group>
                </Form>
            </div>
        </Container>
    );
};

export default Edit;