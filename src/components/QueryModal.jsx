import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

const QueryModal = ({ open, onClose, query }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Query Details</DialogTitle>
      <DialogContent>
        {query && (
          <>
            <Typography variant="body1">
              <strong>Name:</strong> {query.name}
            </Typography>
            <Typography variant="body1">
              <strong>Email:</strong> {query.email}
            </Typography>
            <Typography variant="body1">
              <strong>Message:</strong> {query.message}
            </Typography>
            <Typography variant="body1">
              <strong>Date:</strong> {new Date(query.created_at).toLocaleString()}
            </Typography>
            <Typography variant="body1">
              <strong>Status:</strong> {query.done ? 'Done' : 'Not Done'}
            </Typography>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default QueryModal;
