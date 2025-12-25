import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Box, Card, Button, Grid, Alert, AppBar, Toolbar, IconButton } from '@mui/material';
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
    const userRole = getRole();
    if (userRole === 'AUDITOR') {
      navigate('/audit');
      return;
    }
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, navigate]);

  const fetchData = async () => {
    try {
      const balanceRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/accounts/balance`);
      setBalance(balanceRes.data.balance);
      const accountsRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/accounts/me`);
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
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1" sx={{ mb: 1, fontWeight: 600 }}>
            Welcome to your Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your digital equity ledger
          </Typography>
        </Box>
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ minHeight: 140, display: 'flex', alignItems: 'center', p: 3, boxShadow: 2 }}>
              <AccountBalanceWallet sx={{ mr: 3, fontSize: 48, color: 'primary.main' }} />
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Total Balance
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  ${balance.toLocaleString()}
                </Typography>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ minHeight: 140, p: 3, boxShadow: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <AccountBalance sx={{ mr: 1, color: 'primary.main' }} />
                Your Accounts
              </Typography>
              {accounts.length > 0 ? (
                accounts.map(acc => (
                  <Typography key={acc._id} variant="body2" sx={{ mb: 1, color: 'text.primary' }}>
                    {acc.name} - {acc.type}
                  </Typography>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No accounts available
                </Typography>
              )}
            </Card>
          </Grid>
        </Grid>
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          {role === 'INVESTOR' && (
            <Button variant="contained" size="large" startIcon={<TransferWithinAStation />} onClick={() => navigate('/transfer')} sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}>
              Transfer Equity
            </Button>
          )}
          {role === 'ISSUER' && (
            <Button variant="contained" size="large" startIcon={<AccountBalance />} onClick={() => navigate('/issue')} sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}>
              Issue Equity
            </Button>
          )}
        </Box>
      </Container>
    </>
  );
};

export default Dashboard;