import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const Landing = () => {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    try {
      const response = await axios.get('https://localhost:8000/users');
      setUsers(response.data);
    } 
    catch (error) {
      console.log("Could not get user.");
    }
  }
  const [filteredUsers, setFilteredUsers] = useState([])

  useEffect(() => {
    getUsers();
  }, []); 

  const handleFilter = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const newFilteredUsers = []
    for (const user of users) {
      if (user && user.username && user.emaiL && (user.username.toLowerCase().includes(searchTerm) || user.emaiL.toLowerCase().includes(searchTerm))) {
        newFilteredUsers.push(user)
      }
    }
    setFilteredUsers(newFilteredUsers)
  };
  

  return (
    <>
      <h2>Landing (Protected)</h2>

      <div className='filter-container'>
        <input
          type="text"
          placeholder="Filter by username or email."
          onInput={handleFilter}
        />
      </div>

      <div className="table-container">
        {filteredUsers && filteredUsers.map((user, index) => (
          <div key={index}>
            <p>{user.username} - {user.emaiL}</p>
          </div>
        ))}
      </div>
    </>
  );
};
