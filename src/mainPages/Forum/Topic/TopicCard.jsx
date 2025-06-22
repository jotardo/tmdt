import React from 'react';
import { Card, CardContent, CardActions, Button, Typography, Box, Chip, Avatar } from '@mui/material';

function TopicCard({ topic, onSelect }) {
  return (
    <Card
      sx={{
        mb: 2,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': { transform: 'scale(1.02)', boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)' },
      }}
    >
      <CardContent sx={{ display: 'flex', gap: 2 }}>
        <Avatar src={`http://localhost:8080/api/user/${topic.avatar}`} alt={topic.author} sx={{ width: 40, height: 40 }} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" color="primary">
            {topic.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {topic.content}
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Typography variant="caption">👤 {topic.author}</Typography>
              <Typography variant="caption">💬 {topic.commentCount || 0}</Typography>
              <Typography variant="caption">👀 {topic.views || 0}</Typography>
            </Box>
            <Typography variant="caption">{topic.createdAt}</Typography>
          </Box>
          <Chip label={"Sản phẩm liên quan: "+topic.categoryName} size="small" sx={{ mt: 1 }} />
        </Box>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          color="primary"
          onClick={() => {
            console.log('Selecting topic:', topic);
            onSelect(topic.id);
          }}
          sx={{
            '&:hover': { transform: 'scale(1.05)', bgcolor: 'primary.light' },
            transition: 'all 0.2s ease',
          }}
        >
          Xem chi tiết
        </Button>
      </CardActions>
    </Card>
  );
}

export default TopicCard;