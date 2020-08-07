import React, { useState } from 'react';
import Routes from './Routes';
import Nav from './shared/Nav';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {

  const getUser = () => {
    const user = sessionStorage.getItem('user');
    if (user) return JSON.parse(user);
    return false;
  }

  //console.log("User currently in sessionStorage is :" + getUser());

  const [user, setUser] = useState(getUser());

  return (
    <>
      <ToastContainer />
          <Nav user={user}/>
          <Routes user={user} setUser={setUser}/>
    </>
  );
}

export default App;
