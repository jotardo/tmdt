import React, { useEffect, useState } from 'react';
import { Alert, Container, Grid, Box, List, ListItem, ListItemButton, ListItemText, Typography, CircularProgress, Drawer, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import TopicList from './Topic/TopicList'; // Cập nhật đường dẫn nếu cần
import topicApi from '../../backend/db/topicApi';
import categoryApi from '../../backend/db/categoryApi';

export default function ForumHome() {
  const [topics, setTopics] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [topicDetailLoading, setTopicDetailLoading] = useState(false); // Thêm loading cho chi tiết
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleCreateTopic = (newTopic) => {
    if (!selectedCategory || newTopic.categoryID === selectedCategory) {
      setTopics([...topics, newTopic]);
    }
    setShowCreateForm(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await categoryApi.fetchAllCategories();
        if (Array.isArray(response.data.categories)) {
          setCategories(response.data.categories);
        } else {
          setError('Dữ liệu danh mục không hợp lệ');
        }
      } catch (err) {
        setError('Không thể tải danh mục');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        const response = await topicApi.fetchAll();
        console.log('API response:', response);
        if (Array.isArray(response.data)) {
          if (selectedCategory) {
            setTopics(response.data.filter((topic) => topic.categoryID === selectedCategory));
          } else {
            setTopics(response.data);
          }
        } else {
          setError('Dữ liệu chủ đề không hợp lệ');
        }
      } catch (err) {
        setError('Không thể tải danh sách chủ đề');
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, [selectedCategory]);

  useEffect(() => {
    const fetchTopicDetail = async () => {
      if (selectedTopicId) {
        try {
          setTopicDetailLoading(true); // Bật loading chi tiết
          const response = await topicApi.fetchById(selectedTopicId);
          setSelectedTopic(response.data);
        } catch (err) {
          setError('Không thể tải chi tiết chủ đề');
          setSelectedTopic(null);
        } finally {
          setTopicDetailLoading(false);
        }
      } else {
        setSelectedTopic(null);
      }
    };
    fetchTopicDetail();
  }, [selectedTopicId]);

  const drawerContent = (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        Danh mục
      </Typography>
      <List>
        <ListItem disablePadding>
          <ListItemButton
            selected={!selectedCategory}
            onClick={() => setSelectedCategory(null)}
            sx={{
              borderRadius: 1,
              '&.Mui-selected': { bgcolor: 'primary.light', color: 'primary.main' },
              '&:hover': { bgcolor: 'grey.100', transform: 'translateX(4px)' },
              transition: 'all 0.2s ease',
            }}
          >
            <ListItemText primary="Tất cả" />
          </ListItemButton>
        </ListItem>
        {categories.map((category) => (
          <ListItem key={category.id} disablePadding>
            <ListItemButton
              selected={selectedCategory === category.id}
              onClick={() => setSelectedCategory(category.id)}
              sx={{
                borderRadius: 1,
                '&.Mui-selected': { bgcolor: 'primary.light', color: 'primary.main' },
                '&:hover': { bgcolor: 'grey.100', transform: 'translateX(4px)' },
                transition: 'all 0.2s ease',
              }}
            >
              <ListItemText primary={category.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <IconButton
        color="inherit"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{ mb: 2, display: { md: 'none' } }}
      >
        <MenuIcon />
      </IconButton>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress />
        </Box>
      )}
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Box
            sx={{
              display: { xs: 'none', md: 'block' },
              position: 'sticky',
              top: 20,
              bgcolor: 'background.paper',
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              p: 2,
            }}
          >
            {drawerContent}
          </Box>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: 240 } }}
          >
            {drawerContent}
          </Drawer>
        </Grid>
        <Grid item xs={12} md={9}>
          {topicDetailLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <CircularProgress />
            </Box>
          )}
          <TopicList
            topics={topics}
            selectedTopic={selectedTopic} // Truyền selectedTopic
            onSelectTopic={setSelectedTopicId}
            onShowCreateForm={() => setShowCreateForm(true)}
            showCreateForm={showCreateForm}
            onCreateTopic={handleCreateTopic}
            onBack={() => setSelectedTopicId(null)} // Nút quay lại
          />
        </Grid>
      </Grid>
    </Container>
  );
}