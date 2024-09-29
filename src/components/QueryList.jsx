// QueryList.js
import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Tooltip,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from '@mui/icons-material';
import axios from 'axios';

const QueryList = ({ queries, onOpenQueryModal , fetchQueries}) => {
  const [loadingStates, setLoadingStates] = useState({
    loadingDelete: null,
    loadingDone: null,
    loadingStarred: null,
  });

 


  const handleToggleDone = async (queryId, currentDoneStatus) => {
    setLoadingStates(prev => ({ ...prev, loadingDone: queryId }));
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/queries/${queryId}/`,
        { done: !currentDoneStatus },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      await fetchQueries();
    } catch (error) {
      console.error('Failed to toggle done status:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, loadingDone: null }));
    }
  };

  const handleToggleStarred = async (queryId, currentStarredStatus) => {
    setLoadingStates(prev => ({ ...prev, loadingStarred: queryId }));
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/queries/${queryId}/`,
        { starred: !currentStarredStatus },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      await fetchQueries();
    } catch (error) {
      console.error('Failed to toggle starred status:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, loadingStarred: null }));
    }
  };

  const handleDeleteQuery = async (queryId) => {
    setLoadingStates(prev => ({ ...prev, loadingDelete: queryId }));
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/queries/${queryId}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      await fetchQueries();
    } catch (error) {
      console.error('Failed to delete query:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, loadingDelete: null }));
    }
  };

  return (
    <List>
      {queries.map((query) => (
        <ListItem
          key={query.id}
          divider
          sx={{
            cursor: 'pointer',
            '&:hover': { backgroundColor: '#f0f0f0' },
          }}
          onClick={() => onOpenQueryModal(query)}
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

          {/* Star/Unstar Toggle */}
          <Tooltip title={query.starred ? 'Unstar' : 'Star'}>
            <Button
              onClick={(e) => {
                e.stopPropagation(); // Prevent modal opening
                handleToggleStarred(query.id, query.starred);
              }}
              sx={{ marginLeft: 'auto' }}
              disabled={loadingStates.loadingStarred === query.id}
            >
              {loadingStates.loadingStarred === query.id ? (
                <CircularProgress size={20} />
              ) : (query.starred ? <StarIcon color="warning" /> : <StarBorderIcon />)}
            </Button>
          </Tooltip>

          {/* Done/Not Done Toggle with CircularProgress */}
          <Tooltip title={query.done ? 'Mark as not done' : 'Mark as done'}>
            <Button
              onClick={(e) => {
                e.stopPropagation(); // Prevent modal opening
                handleToggleDone(query.id, query.done);
              }}
              sx={{ marginLeft: '10px', color: query.done ? 'green' : 'red' }}
              disabled={loadingStates.loadingDone === query.id} // Disable when updating
            >
              {loadingStates.loadingDone === query.id ? (
                <CircularProgress size={20} />
              ) : (
                query.done ? 'Done' : 'Not Done'
              )}
            </Button>
          </Tooltip>

          {/* Delete Button with CircularProgress */}
          <Tooltip title="Delete Query">
            <Button
              variant="text"
              color="error"
              onClick={(e) => {
                e.stopPropagation(); // Prevent modal opening
                handleDeleteQuery(query.id);
              }}
              disabled={loadingStates.loadingDelete === query.id} // Disable when deleting
            >
              {loadingStates.loadingDelete === query.id ? <CircularProgress size={20} /> : <DeleteIcon />}
            </Button>
          </Tooltip>
        </ListItem>
      ))}
    </List>
  );
};

export default QueryList;
