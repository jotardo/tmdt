import React from 'react';
import { Alert, Box, Button, Collapse, Typography } from '@mui/material';
import TopicCard from './TopicCard';
import TopicForm from './TopicForm';
import TopicDetail from './TopicDetail'; // Thêm import
import { useAuth } from '../../../context/AuthContext';

function TopicList({ topics, selectedTopic, onSelectTopic, onShowCreateForm, showCreateForm, onCreateTopic, onBack }) {
  const { user } = useAuth();
  const userDetails = user || JSON.parse(localStorage.getItem("user"));
  const role = userDetails?.role;

  const Header = ({ title, showButton }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, px: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
        {title}
      </Typography>
      {role === 'CTV' && showButton && (
        <Button
          variant="contained"
          onClick={onShowCreateForm}
          sx={{
            bgcolor: 'linear-gradient(45deg, #2196F3, #21CBF3)',
            color: 'white',
            px: 3,
            py: 1,
            borderRadius: 2,
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Tạo chủ đề mới
        </Button>
      )}
    </Box>
  );

  if (selectedTopic) {
    return <TopicDetail topic={selectedTopic} onBack={onBack} />;
  }

  if (!Array.isArray(topics) || topics.length === 0) {
    return (
      <Box sx={{ py: 3 }}>
        <Header title="Không có chủ đề nào" showButton={true} />
        <Alert severity="info" sx={{ mb: 2 }}>
          Hãy tạo chủ đề đầu tiên!
        </Alert>
        <Collapse in={showCreateForm}>
          <TopicForm onSubmit={onCreateTopic} onCancel={() => onShowCreateForm(false)} />
        </Collapse>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 3 }}>
      <Header title="Danh sách chủ đề" showButton={true} />
      <Collapse in={showCreateForm}>
        <TopicForm onSubmit={onCreateTopic} onCancel={() => onShowCreateForm(false)} />
      </Collapse>
      {topics.map((topic) => (
        <TopicCard key={topic.id} topic={topic} onSelect={onSelectTopic} />
      ))}
    </Box>
  );
}

export default TopicList;