import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, TextField, Button, MenuItem, CircularProgress } from '@mui/material';
import categoryApi from '../../../backend/db/categoryApi';
import topicApi from '../../../backend/db/topicApi';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';

function TopicForm({ onSubmit, onCancel }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryID, setCategoryID] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user } = useAuth();
  const userDetails = user || JSON.parse(localStorage.getItem('user'));
  const role = userDetails?.role;
  const ctvID = role === 'CTV' ? userDetails?.id : null;

  useEffect(() => {
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryApi.fetchAllCategories();
      if (Array.isArray(response.data.categories)) {
        setCategories(response.data.categories);
        if (response.data.categories.length > 0) {
          setCategoryID(response.data.categories[0].id); // Tự động chọn danh mục đầu tiên
        }
      } else {
        setCategories([]);
        setError('Dữ liệu danh mục không hợp lệ');
      }
    } catch (err) {
      setCategories([]);
      setError('Không thể tải danh mục');
    } finally {
      setLoading(false);
    }
  };
  fetchCategories();
}, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    setLoading(true);
    setError(null);
    const topicData = { title, content, ctvID, categoryID };
    const response = await topicApi.createTopic(topicData);
    console.log('Topic created:', response.data);
    onSubmit(response.data);
    setTitle('');
    setContent('');
    setCategoryID('');
  } catch (err) {
    console.error('API Error:', err); // Debug
    setError(err.response?.data?.message || 'Không thể tạo chủ đề');
  } finally {
    setLoading(false);
  }
 
};

  return (
    <Box
      sx={{
        mb: 4,
        p: 3,
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        bgcolor: 'background.paper',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography
        variant="h6"
        sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}
      >
        Tạo chủ đề mới
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          <TextField
            label="Tiêu đề"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            disabled={loading}
            sx={{ '& .MuiInputBase-root': { borderRadius: 1 } }}
          />
          <TextField
            label="Nội dung"
            multiline
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            fullWidth
            required
            disabled={loading}
            sx={{ '& .MuiInputBase-root': { borderRadius: 1 } }}
          />
          <TextField
            select
            label="Danh mục"
            value={categoryID}
            onChange={(e) => setCategoryID(e.target.value)}
            fullWidth
            required
            disabled={loading}
            sx={{ '& .MuiInputBase-root': { borderRadius: 1 } }}
          >
            {Array.isArray(categories) && categories.length > 0 ? (
              categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>Không có danh mục</MenuItem>
            )}
          </TextField>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {
              ctvID && (
                <Button
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    '&:hover': {
                      bgcolor: 'primary.dark',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Tạo chủ đề
                </Button>
              )
            }
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={loading}
              sx={{
                px: 3,
                py: 1,
                borderRadius: 2,
                '&:hover': {
                  bgcolor: 'grey.100',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Hủy
            </Button>
          </Box>
          {!ctvID && (
            <Typography color="error" variant="caption">
              Bạn cần là CTV để tạo chủ đề
            </Typography>
          )}
        </form>
      )}
    </Box>
  );
}

TopicForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default TopicForm;