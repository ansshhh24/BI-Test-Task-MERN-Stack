const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

// Invitation Route
router.post('/', async (req, res) => {
  const { email, groupId } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'expenseapp24@gmail.com',
      pass: 'expenseapp24',
    },
  });

  const mailOptions = {
    from: 'ansh.sharma.tech@gmail.com',
    to: email,
    subject: 'You have been invited to join a group',
    text: `You have been invited to join the group with ID: ${groupId}. Please register to join.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ error: 'Failed to send invitation' });
    }
    res.json({ message: 'Invitation sent successfully' });
  });
});

module.exports = router;
