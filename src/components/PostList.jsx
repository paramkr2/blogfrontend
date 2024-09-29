import React from 'react';
import { List, ListItem, ListItemText, Box, Button, Tooltip, Typography, Skeleton, CircularProgress, IconButton } from '@mui/material';
import { Preview as PreviewIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const PostList = React.memo(({ posts, loading, onEdit, onDelete, deletingId, onPreview }) => {
  if (loading) {
    return (
      <List>
        {[1, 2, 3].map((_, index) => (
          <ListItem key={index} divider>
            <Skeleton variant="rectangular" width="100%" height={40} />
          </ListItem>
        ))}
      </List>
    );
  }

  return (
    <List>
      {posts.map((post) => (
        <ListItem
          key={post.id}
          divider
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px',
            '&:hover': { backgroundColor: '#f0f0f0' },
          }}
        >
          {/* Post Title with Tooltip */}
          <ListItemText
            primary={
              <Tooltip title={post.title} arrow>
                <Typography noWrap variant="h6" sx={{ maxWidth: '800px' }}>
                  {post.title}
                </Typography>
              </Tooltip>
            }
          />

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="View" arrow>
              <IconButton
                color="primary"
                onClick={() => onPreview(post.id)}
                sx={{ marginLeft: '10px' }}
                aria-label="Preview post"
              >
                <PreviewIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Edit" arrow>
              <IconButton
                color="secondary"
                onClick={() => onEdit(post.id)}
                sx={{ marginLeft: '10px' }}
                aria-label="Edit post"
              >
                <EditIcon />
              </IconButton>
            </Tooltip>

            {/* Delete Button with Loading State */}
            {deletingId === Number(post.id) ? (
              <CircularProgress size={24} sx={{ marginLeft: '10px' }} color="error" />
            ) : (
              <Tooltip title="Delete" arrow>
                <IconButton
                  color="error"
                  onClick={() => onDelete(post.id)}
                  sx={{ marginLeft: '10px' }}
                  aria-label="Delete post"
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </ListItem>
      ))}
    </List>
  );
});

export default PostList;
