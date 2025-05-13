import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const BackButton = ({ label = "Quay về", sx = {} }) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="outlined"
      onClick={() => navigate(-1)}
      sx={{
        textTransform: "none",
        borderColor: "#ccc",
        color: "#333",
        '&:hover': {
          backgroundColor: '#f5f5f5',
          borderColor: '#aaa',
        },
        ...sx, // allow custom styling
      }}
    >
      <span style={{ marginRight: 8 }}>🔙 {label}</span>
    </Button>
  );
};

export default BackButton;
