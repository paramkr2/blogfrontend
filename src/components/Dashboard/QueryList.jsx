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

  return  (
    <List>
      {queries.map((query) => (
        <ListItem
          key={query.id}
          divider
          sx={{
            cursor: 'pointer',
            '&:hover': { backgroundColor: '#f0f0f0' },
            display: 'flex',
            alignItems: 'center',
          }}
          onClick={() => onOpenQueryModal(query)}
        >
          <ListItemText
            primary={query.name}
            secondary={
              <>
                {/* Truncated message in a single line */}
                <Typography
                  component="span"
                  variant="body2"
                  sx={{
                    display: 'block',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {query.message}
                </Typography>
                {/* Formatted date and time (AM/PM) */}
                <Typography component="span" variant="body2" sx={{ display: 'block' }}>
                  {new Date(query.created_at).toLocaleDateString()} - {new Date(query.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </>
            }
          />

          {/* Star/Unstar Toggle Icon */}
          <Tooltip title={query.starred ? 'Unstar' : 'Star'}>
            <Button
              onClick={(e) => {
                e.stopPropagation(); // Prevent modal opening
                handleToggleStarred(query.id, query.starred);
              }}
              sx={{ minWidth: 0 }} // Reduce button width
              disabled={loadingStates.loadingStarred === query.id}
            >
              {loadingStates.loadingStarred === query.id ? (
                <CircularProgress size={20} />
              ) : (query.starred ? <StarIcon color="warning" /> : <StarBorderIcon />)}
            </Button>
          </Tooltip>

          {/* Done/Not Done Toggle Icon */}
          <Tooltip title={query.done ? 'Mark as not done' : 'Mark as done'}>
            <Button
              onClick={(e) => {
                e.stopPropagation(); // Prevent modal opening
                handleToggleDone(query.id, query.done);
              }}
              sx={{ width:'10%', marginLeft: '5px', color: query.done ? 'green' : 'red' }} // Reduce button width
              disabled={loadingStates.loadingDone === query.id}
            >
              {loadingStates.loadingDone === query.id ? (
                <CircularProgress size={20} />
              ) : (
                query.done ? <Typography variant="body2" sx={{ color: 'green' }}>Done</Typography> : <Typography variant="body2" sx={{ color: 'red' }}>Not Done</Typography>
              )}
            </Button>
          </Tooltip>

          {/* Delete Button Icon */}
          <Tooltip title="Delete Query">
            <Button
              variant="text"
              color="error"
              onClick={(e) => {
                e.stopPropagation(); // Prevent modal opening
                handleDeleteQuery(query.id);
              }}
              sx={{ minWidth: 0, marginLeft: '10px' }} // Reduce button width
              disabled={loadingStates.loadingDelete === query.id}
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
