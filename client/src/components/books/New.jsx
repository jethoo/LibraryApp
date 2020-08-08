import React, { useState } from 'react';
import { Form, Container } from 'react-bootstrap';
import Axios from 'axios';
import { Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';

const New = function (){

    const [inputs, setInputs] = useState({
        title: '',
        length: '',
        price: ''
    });

    const [redirect, setRedirect ] = useState(false);

    const handleSubmit = async event => {

        event.preventDefault();

        try {
            const resp = await Axios.post('/api/books', inputs);

            if(resp.status === 200){
                toast("The book was added succcessfully", {
                    type: toast.TYPE.SUCCESS
                });
                setRedirect(true);
            }
        } catch(error){
            toast("There was an issue adding the book", {
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

    if (redirect) return (<Redirect to="/books"/>);

   
    return  (
        <Container className="my-5">
            <header>
                <h1>Add New Book</h1>
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
                        <button type="submit" className="btn-primary">Create</button>
                    </Form.Group>
                </Form>
            </div>
        </Container>
    );
};

export default New;