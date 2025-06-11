import React, { useState, useEffect } from 'react';

function Home() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/home', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        console.log(data);
        setUsers(data); // Do something with the fetched data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);
  

  return (
    <div>
      <h1>Danh sách người dùng</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {users.length > 0 ? (
        users.map((user) => (
          <div key={user.id}>
            <h2>Tên: {user.username}</h2>
          </div>
        ))
      ) : (
        !error && <p>Không có dữ liệu.</p>
      )}
    </div>
  );
}

export default Home;
