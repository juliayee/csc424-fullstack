import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from "./context/AuthProvider";

const Landing = () => {
  const { value } = useAuth();
  const [users, setUsers] = useState([]);

useEffect(() => {
    axios.get('/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));
  }, []); 

  return (
    <>
      <h2>Contacts List (Protected)</h2>
     <div> Authenticated as {value.token}</div>
     <div> 
     <ul>
        {users.map(user => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
     </div>
    </>
  );
};


export default Landing;
