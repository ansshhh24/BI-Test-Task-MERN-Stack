import { Typography } from "@mui/material"
import { Box, Container } from "@mui/system"
import Copyright from "./Copyright"
import React, { useState } from 'react';
import axios from 'axios';



const Invite = () => {
  const [email, setEmail] = useState('');
  const [groupId, setGroupId] = useState('');
  const [message, setMessage] = useState('');
  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/invite', { email, groupId });
      setMessage(response.data.message);
    } catch (error) {
      console.error(error);
      setMessage('Failed to send invitation');
    }
  };


  return (
    <>
<Container maxWidth='md' sx={{
            bgcolor: 'background.paper',
            boxShadow: 2,
            my: 10,
            py:10
        }}>
 <div>
      <h2>Invite</h2>
      <form onSubmit={handleInvite}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        
        <button type="submit">Send Invitation</button>
      </form>
      {message && <p>{message}</p>}
    </div>
</Container>
 </>
  )
}

export default Invite