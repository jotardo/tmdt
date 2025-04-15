import { Card, CardContent, Typography } from '@mui/material';

function InfoCard({ title, value, children }) {
  return (
    <Card>
      <CardContent style={{ display: 'flex', alignItems: 'center' }}>
        {children}
        <div>
          <Typography variant="subtitle2" color="textSecondary">
            {title}
          </Typography>
          <Typography variant="h6">{value}</Typography>
        </div>
      </CardContent>
    </Card>
  );
}

export default InfoCard
