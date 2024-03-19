import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const Landing = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');

  const getUsers = async () => {
    try {
      const response = await axios.get('https://localhost:8000/users');
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

  // Filter the users based on username or email
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(filter) ||
    user.email.toLowerCase().includes(filter)
  );

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
            {filteredUsers.length > 0 && filteredUsers.map((user, index) => (
              <tr key={index}>
                <td>{user.username}</td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
