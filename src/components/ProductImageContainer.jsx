import { useState } from "react";
import { Box, Grid, IconButton } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.css";

export default function ProductImageContainer({ image_urls, mainImageSize = { width: 400, height: 400 } }) {
  const [index, setIndex] = useState(0);

  const decrementIndex = () => {
    setIndex((prev) => {
      let value = prev - 1;
      if (value < 0) value = image_urls.length - 1;
      return value;
    });
  };

  const incrementIndex = () => {
    setIndex((prev) => {
      let value = prev + 1;
      if (value >= image_urls.length) value = 0;
      return value;
    });
  };

  const handleThumbnailClick = (idx) => {
    setIndex(idx);
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Main Image Container */}
      <Box
        sx={{
          width: mainImageSize.width,
          height: mainImageSize.height,
          overflow: "hidden",
          borderRadius: 2,
          backgroundColor: "#f5f5f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <InnerImageZoom
          src={image_urls && image_urls.length > 0 ? image_urls[index].url : "/assets/empty-wishlist.png"}
          zoomSrc={image_urls && image_urls.length > 0 ? image_urls[index].url : "/assets/empty-wishlist.png"}
          imgAttributes={{
            style: {
              width: "100%",
              height: "100%",
              objectFit: "contain",
            },
          }}
        />
        {image_urls && image_urls.length > 0 && (
          <>
            <IconButton
              sx={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", bgcolor: "rgba(255, 255, 255, 0.8)" }}
              onClick={decrementIndex}
            >
              <ArrowBack />
            </IconButton>
            <IconButton
              sx={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", bgcolor: "rgba(255, 255, 255, 0.8)" }}
              onClick={incrementIndex}
            >
              <ArrowForward />
            </IconButton>
          </>
        )}
      </Box>

      {/* Thumbnails */}
      {image_urls && image_urls.length > 0 && (
        <Grid container spacing={1} sx={{ mt: 2 }}>
          {image_urls.map((img, idx) => (
            <Grid item xs={3} key={img.id}>
              <Box
                sx={{
                  cursor: "pointer",
                  border: index === idx ? "2px solid #1976d2" : "2px solid transparent",
                  borderRadius: 1,
                  overflow: "hidden",
                  "&:hover": { borderColor: "#1976d2" },
                }}
                onClick={() => handleThumbnailClick(idx)}
              >
                <img
                  src={img.url}
                  alt={`Thumbnail ${idx + 1}`}
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                  }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}