// client/src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [form, setForm] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:3001/register', form);
      alert('Registered Successfully');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />
      <input name="department" placeholder="Department" onChange={handleChange} />
      <select name="role" onChange={handleChange}>
        <option value="">Select Role</option>
        <option value="student">Student</option>
        <option value="alumni">Alumni</option>
      </select>
      <input name="year_of_passing" placeholder="Year of Passing" onChange={handleChange} />
      <input name="current_position" placeholder="Current Position" onChange={handleChange} />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default Register;