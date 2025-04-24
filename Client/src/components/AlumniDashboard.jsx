// client/src/components/AlumniDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AlumniDashboard() {
  const [requests, setRequests] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchScholarshipRequests();
  }, []);

  const fetchScholarshipRequests = async () => {
    const res = await axios.get('http://localhost:3001/scholarship');
    setRequests(res.data);
  };

  const respondToRequest = async (id, status) => {
    await axios.put(`http://localhost:3001/scholarship/${id}`, { status });
    fetchScholarshipRequests();
  };

  const scheduleMeeting = async () => {
    await axios.post('http://localhost:3001/meetings', {
      alumni_id: user.user_id,
      title,
      description,
      meeting_date: meetingDate,
    });
    alert('Meeting Scheduled');
  };

  return (
    <div>
      <h2>Welcome, {user.name}</h2>
      <h3>Scholarship Requests</h3>
      <ul>
        {requests.map((r) => (
          <li key={r.scholarship_id}>
            Student #{r.student_id}: {r.reason} — Status: {r.status}
            {r.status === 'pending' && (
              <>
                <button onClick={() => respondToRequest(r.scholarship_id, 'approved')}>Approve</button>
                <button onClick={() => respondToRequest(r.scholarship_id, 'denied')}>Deny</button>
              </>
            )}
          </li>
        ))}
      </ul>

      <h3>Schedule a Meeting</h3>
      <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
      <textarea placeholder="Description" onChange={(e) => setDescription(e.target.value)}></textarea>
      <input type="datetime-local" onChange={(e) => setMeetingDate(e.target.value)} />
      <button onClick={scheduleMeeting}>Schedule</button>
    </div>
  );
}

export default AlumniDashboard;
