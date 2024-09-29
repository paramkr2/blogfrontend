import React, { useState, useEffect } from 'react';
import {
  Button,
  Box,
  Typography,
  Tooltip,
  Pagination,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from '@mui/icons-material';
import axios from 'axios';
import QueryModal from './QueryModal'; // Assuming QueryModal is in the same directory
import QueryList from './QueryList'


const QueryManager = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [queryModalOpen, setQueryModalOpen] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [filterDone, setFilterDone] = useState(null); // null = no filter, true/false = filter done status
  const [filterStarred, setFilterStarred] = useState(null); // null = no filter, true = show starred only
  
  const fetchQueries = async () => {
    try {
      let filterParams = `?pageno=${page}`;
      if (filterDone !== null) filterParams += `&done=${filterDone}`;
      if (filterStarred !== null) filterParams += `&starred=${filterStarred}`;

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/queries/${filterParams}`, {
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
  }, [page, filterDone, filterStarred]);

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

  const handleFilterDone = () => {
    setFilterDone(filterDone === true ? null : true); // Toggles between null and true (show done only)
  };

  const handleFilterStarred = () => {
    setFilterStarred(filterStarred === true ? null : true); // Toggles between null and true (show starred only)
  };

  return (
  <Box>
    {/* Filter Checkboxes */}
      <Box display="flex" gap={2} mb={2}>
        <FormControlLabel
          control={
            <Checkbox
              checked={filterDone === true}
              onChange={() => setFilterDone(filterDone === true ? null : true)}
              color="primary"
            />
          }
          label="Show Done Only"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={filterStarred === true}
              onChange={() => setFilterStarred(filterStarred === true ? null : true)}
              color="secondary"
            />
          }
          label="Show Starred Only"
        />
      </Box>
    {/* Query List */}
    {loading ? (
      <p>Loading queries...</p>
    ) : queries.length === 0 ? (
      <p>No queries found.</p>
    ) : (
      <QueryList queries={queries} onOpenQueryModal={handleOpenQueryModal} fetchQueries={fetchQueries} />
    )}

    {/* Pagination */}
    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
      <Pagination
        count={Math.ceil(count / 10)} // Assuming 10 queries per page
        page={page}
        onChange={handlePageChange}
        color="primary"
      />
    </Box>

    {/* Query Modal */}
    <QueryModal open={queryModalOpen} onClose={handleCloseQueryModal} query={selectedQuery} />
  </Box>
);
}

export default QueryManager;