import React, { useState } from "react";
import { Button, TextField, Box, CircularProgress, Typography } from "@mui/material";
import axios from "axios";

const AIGenerateImageForm = ({ onImageGenerated }) => {
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [error, setError] = useState("");

    const handleGenerate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setImage(null);

        try {
            const payload = {
                prompt: prompt || "A simple diamond necklace made of white gold, high detail, studio lighting, product photography, white background",
                negative_prompt: "blurry, low quality, watermark, text, logo, cropped, out of frame",
                steps: 28,
                width: 512,
                height: 512,
                cfg_scale: 7,
                sampler_name: "DPM++ 2M Karras",
                seed: -1,
                batch_size: 1,
                n_iter: 1
            };
            const res = await axios.post(
                "http://localhost:7860/sdapi/v1/txt2img",
                payload,
                { headers: { "Content-Type": "application/json" } }
            );
            if (res.data.images && res.data.images.length > 0) {
                const base64Img = res.data.images[0];
                setImage(`data:image/png;base64,${base64Img}`);
                if (onImageGenerated) onImageGenerated(base64Img);
            } else {
                setError("Không nhận được ảnh từ AI.");
            }
        } catch (err) {
            setError("Không thể tạo ảnh AI.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleGenerate}
            sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 500, mx: "auto", mt: 3 }}
        >
            <Typography variant="h6">Tạo ảnh AI cho sản phẩm</Typography>
            <TextField
                label="Nhập yêu cầu (prompt)"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Ví dụ: A luxury silver ring with diamonds, high detail, white background"
                fullWidth
                multiline
                minRows={2}
            />
            <Button
                type="submit"
                variant="contained"
                disabled={loading}
            >
                {loading ? <CircularProgress size={24} /> : "Tạo ảnh AI"}
            </Button>
            {error && <Typography color="error">{error}</Typography>}
            {image && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1">Kết quả:</Typography>
                    <img src={image} alt="AI result" style={{ width: "100%", maxWidth: 400, borderRadius: 8, border: "1px solid #eee" }} />
                </Box>
            )}
        </Box>
    );
};

export default AIGenerateImageForm;
