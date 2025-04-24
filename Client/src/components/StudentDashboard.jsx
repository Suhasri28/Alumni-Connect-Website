// client/src/components/StudentDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function StudentDashboard() {
  const [scholarshipStatus, setScholarshipStatus] = useState(null);
  const [alumni, setAlumni] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [reason, setReason] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchScholarship();
    fetchAlumni();
    fetchMeetings();
  }, []);

  const fetchScholarship = async () => {
    const res = await axios.get(`http://localhost:3001/scholarship/${user.user_id}`);
    setScholarshipStatus(res.data);
  };

  const fetchAlumni = async () => {
    const res = await axios.get('http://localhost:3001/alumni');
    setAlumni(res.data);
  };

  const fetchMeetings = async () => {
    const res = await axios.get('http://localhost:3001/meetings');
    setMeetings(res.data);
  };

  const requestScholarship = async () => {
    await axios.post('http://localhost:3001/scholarship', {
      student_id: user.user_id,
      reason
    });
    fetchScholarship();
  };

  return (
    <div>
      <h2>Welcome, {user.name}</h2>
      <h3>Scholarship Request</h3>
      {scholarshipStatus ? (
        <p>Status: {scholarshipStatus.status}</p>
      ) : (
        <div>
          <textarea placeholder="Reason" onChange={(e) => setReason(e.target.value)}></textarea>
          <button onClick={requestScholarship}>Request</button>
        </div>
      )}

      <h3>All Alumni</h3>
      <ul>
        {alumni.map((a) => (
          <li key={a.user_id}>{a.name} - {a.department} ({a.year_of_passing}) - {a.current_position}</li>
        ))}
      </ul>

      <h3>Scheduled Meetings</h3>
      <ul>
        {meetings.map((m) => (
          <li key={m.meeting_id}>{m.title} on {new Date(m.meeting_date).toLocaleString()}</li>
        ))}
      </ul>
    </div>
  );
}

export default StudentDashboard;
