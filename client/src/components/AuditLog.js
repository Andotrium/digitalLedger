import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert, AppBar, Toolbar, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { ExitToApp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../contexts/AuthContext';

const AuditLog = () => {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState('');
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchEntries();
  }, [token, navigate]);

  const fetchEntries = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/audit/ledger`);
      setEntries(res.data);
    } catch (err) {
      setError('Failed to fetch audit log');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown Date';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleString();
  };

  const formatAmount = (amount) => {
    if (amount == null) return '$0';
    return `$${Number(amount).toLocaleString()}`;
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Digital Ledger - Audit Log
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <ExitToApp />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1" sx={{ mb: 1, fontWeight: 600 }}>
            Audit Log
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Immutable journal entries for compliance and verification
          </Typography>
        </Box>
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {isMobile ? (
          <Box>
            {entries.length > 0 ? (
              entries.map((entry) => (
                <Paper key={entry._id} sx={{ mb: 2, p: 2, boxShadow: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    {formatTimestamp(entry.Timestamp || entry.timestamp)}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                    {entry.description || 'Transaction'}
                  </Typography>
                  {entry.lines.map((line, index) => {
                    const isDebit = line.debit > 0;
                    const amount = isDebit ? line.debit : line.credit;
                    const accountName = line.account?.name || 'Unknown Account';
                    return (
                      <Box key={index} sx={{ mb: 1, pl: 2, borderLeft: '2px solid', borderColor: 'grey.300' }}>
                        <Typography variant="body2" color="text.secondary">
                          {isDebit ? 'Debit' : 'Credit'}: {accountName}
                        </Typography>
                        <Typography variant="body1" sx={{ fontFamily: 'monospace', textAlign: 'right' }}>
                          {formatAmount(amount)}
                        </Typography>
                      </Box>
                    );
                  })}
                </Paper>
              ))
            ) : (
              <Paper sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                No audit entries available
              </Paper>
            )}
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Timestamp</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Action / Reason</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Debit Account</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Credit Account</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'text.primary', textAlign: 'right' }}>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {entries.length > 0 ? (
                  entries.map((entry) => (
                    <React.Fragment key={entry._id}>
                      {entry.lines.map((line, index) => {
                        const isDebit = line.debit > 0;
                        const isCredit = line.credit > 0;
                        const amount = isDebit ? line.debit : line.credit;
                        const accountName = line.account?.name || 'Unknown Account';
                        return (
                          <TableRow key={`${entry._id}-${index}`} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'grey.25' } }}>
                            {index === 0 && (
                              <TableCell rowSpan={entry.lines.length} sx={{ verticalAlign: 'top', borderBottom: 'none' }}>
                                {formatTimestamp(entry.Timestamp || entry.timestamp)}
                              </TableCell>
                            )}
                            {index === 0 && (
                              <TableCell rowSpan={entry.lines.length} sx={{ verticalAlign: 'top', borderBottom: 'none' }}>
                                {entry.reason || entry.description || 'Transaction'}
                              </TableCell>
                            )}
                            <TableCell sx={{ color: isDebit ? 'error.main' : 'text.primary' }}>
                              {isDebit ? accountName : '-'}
                            </TableCell>
                            <TableCell sx={{ color: isCredit ? 'success.main' : 'text.primary' }}>
                              {isCredit ? accountName : '-'}
                            </TableCell>
                            <TableCell sx={{ textAlign: 'right', fontFamily: 'monospace' }}>
                              {formatAmount(amount)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </React.Fragment>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                      No audit entries available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </>
  );
};

export default AuditLog;