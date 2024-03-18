import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const Landing = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState([]);

  const getUsers = async () => {
    try {
      const response = await axios.get('https://localhost:8000/users');
      //console.log(response.data);
      setUsers(response.data);
    } 
    catch (error) {
      console.log("Could not get user.");
    }
  }

  useEffect(() => {
    getUsers();
  }, []); 

  const handleFilter = (e) => {
    setFilter(e.target.value.toLowerCase());
  };

  const filterUsers = users.filter(username => {
    return (
      username.username.toLowerCase().includes(filter) ||
      username.email.toLowerCase().includes(filter)
    );
  });

  return (
    <>
      <h2>Landing (Protected)</h2>

      <div className='filter-container'>
        <input
          type="text"
          placeholder="Filter by username or email."
          onChange={handleFilter}
        />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {filterUsers.map((username, index) => (
              <tr key={index}>
                <td>{username.username || 'N/A'}</td>
                <td>{username.email || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
