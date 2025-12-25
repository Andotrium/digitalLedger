import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Box, Card, CardContent, Button, Grid, Alert, AppBar, Toolbar, IconButton } from '@mui/material';
import { AccountBalance, AccountBalanceWallet, TransferWithinAStation, ExitToApp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../contexts/AuthContext';

const Dashboard = () => {
  const [balance, setBalance] = useState(0);
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState('');
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [token, navigate]);

  const fetchData = async () => {
    try {
      const balanceRes = await axios.get('http://localhost:8080/api/accounts/balance');
      setBalance(balanceRes.data.balance);
      const accountsRes = await axios.get('http://localhost:8080/api/accounts/me');
      setAccounts(accountsRes.data);
    } catch (err) {
      setError('Failed to fetch data');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRole = () => {
    if (!token) return '';
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
  };

  const role = getRole();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Digital Ledger
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <ExitToApp />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Welcome to your Dashboard
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                <AccountBalanceWallet sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Balance</Typography>
                  <Typography variant="h4">{balance}</Typography>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  <AccountBalance sx={{ mr: 1 }} />
                  Your Accounts
                </Typography>
                {accounts.map(acc => (
                  <Typography key={acc._id} sx={{ mb: 0.5 }}>
                    {acc.name} - {acc.type}
                  </Typography>
                ))}
              </Card>
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            {role === 'INVESTOR' && (
              <Button variant="contained" size="large" startIcon={<TransferWithinAStation />} onClick={() => navigate('/transfer')} sx={{ mr: 2 }}>
                Transfer Equity
              </Button>
            )}
            {role === 'ISSUER' && (
              <Button variant="contained" size="large" startIcon={<AccountBalance />} onClick={() => navigate('/issue')} sx={{ mr: 2 }}>
                Issue Equity
              </Button>
            )}
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Dashboard;