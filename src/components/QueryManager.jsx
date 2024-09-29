import React, { useState, useEffect } from 'react';
import { Button,List, ListItem, ListItemText, Box, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Pagination } from '@mui/material';
import axios from 'axios';

const QueryManager = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [queryModalOpen, setQueryModalOpen] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  const fetchQueries = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/queries/?pageno=${page}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setQueries(response.data.results || []);
      setCount(response.data.count || 0);
    } catch (error) {
      console.error('Failed to fetch queries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchQueries();
  }, [page]);

  const handleOpenQueryModal = (query) => {
    setSelectedQuery(query);
    setQueryModalOpen(true);
  };

  const handleCloseQueryModal = () => {
    setQueryModalOpen(false);
    setSelectedQuery(null);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Box>
      {/* Query List */}
      {loading ? (
        <p>Loading queries...</p>
      ) : queries.length === 0 ? (
        <p>No queries found.</p>
      ) : (
        <List>
          {queries.map((query) => (
            <ListItem
              key={query.id}
              divider
              sx={{
                cursor: 'pointer',
                '&:hover': { backgroundColor: '#f0f0f0' }, // Greyer background on hover
              }}
              onClick={() => handleOpenQueryModal(query)} // Open modal on row click
            >
              <ListItemText
                primary={query.name}
                secondary={
                  <>
                    <Typography component="span" variant="body2">
                      {query.email}
                    </Typography>
                    <Typography component="span" variant="body2" sx={{ display: 'block' }}>
                      {new Date(query.created_at).toLocaleString()}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      )}

      {/* Pagination */}
      <Pagination
        count={Math.ceil(count / 5)}
        page={page}
        onChange={handlePageChange}
        sx={{ marginTop: '20px' }}
      />

      {/* Query Modal */}
      <Dialog open={queryModalOpen} onClose={handleCloseQueryModal} fullWidth>
        <DialogTitle>Query Details</DialogTitle>
        <DialogContent>
          {selectedQuery && (
            <>
              <Typography variant="body1">
                <strong>Name:</strong> {selectedQuery.name}
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong> {selectedQuery.email}
              </Typography>
              <Typography variant="body1">
                <strong>Message:</strong> {selectedQuery.message}
              </Typography>
              <Typography variant="body1">
                <strong>Date:</strong> {new Date(selectedQuery.created_at).toLocaleString()}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseQueryModal} variant="contained">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QueryManager;
