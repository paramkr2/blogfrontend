import React from 'react';
import { Grid, Box, Button, Tooltip, Typography, Skeleton, CircularProgress } from '@mui/material';
import { Preview as PreviewIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const PostList = React.memo(({ posts, loading, onEdit, onDelete, deletingId, onPreview }) => {
  if (loading) {
    return (
      <Grid container spacing={2}>
        {[1, 2, 3].map((_, index) => (
          <Grid item xs={12} key={index}>
            <Skeleton variant="rectangular" width="100%" height={80} />
          </Grid>
        ))}  
      </Grid>
    );
  }

  return (
    <Grid container spacing={2}>
      {posts.map((post) => (
        <Grid item xs={12} key={post.id} className="post-item">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
            }}
          >
            <Tooltip title={post.title}>
              <Typography noWrap variant="h6" component="h3" sx={{ maxWidth: '800px' }}>
                {post.title}
              </Typography>
            </Tooltip>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title="View" arrow>
                <Button variant="text" color="primary" onClick={() => onPreview(post.id)} sx={{ marginLeft: '10px', minWidth: 'auto', padding: 0 }} aria-label="Preview post">
                  <PreviewIcon />
                </Button>
              </Tooltip>
              <Tooltip title="Edit" arrow>
                <Button variant="text" color="secondary" onClick={() => onEdit(post.id)} sx={{ marginLeft: '10px', minWidth: 'auto', padding: 0 }} aria-label="Edit post">
                  <EditIcon />
                </Button>
              </Tooltip>
              { deletingId == Number(post.id) ? (
                <CircularProgress size={24} sx={{ marginLeft: '10px' }} color="error" />
                ) : (
                  <Tooltip title="Delete" arrow>
                    <Button
                      variant="text"
                      color="secondary"
                      onClick={() => onDelete(post.id)}
                      sx={{
                        marginLeft: '10px',
                        minWidth: 'auto',
                        padding: 0,
                      }}
                      aria-label="Delete post"
                    >
                      <DeleteIcon />
                    </Button>
                  </Tooltip>
                )}
            </div>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
});

export default PostList;
