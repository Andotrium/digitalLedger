import React, { useState, useContext } from 'react';
import { TextField, Button, Container, Typography, Box, Alert, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../contexts/AuthContext';

const Issue = () => {
  const [toEmail, setToEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/ledger/issue', { toUserEmail: toEmail, amount: parseFloat(amount) });
      setSuccess('Equity issued successfully');
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Issue failed');
      setSuccess('');
    }
  };

  if (!token) {
    navigate('/login');
    return null;
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center">
            Issue Equity
          </Typography>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Investor Email"
              value={toEmail}
              onChange={(e) => setToEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Issue
            </Button>
            <Button fullWidth onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Issue;