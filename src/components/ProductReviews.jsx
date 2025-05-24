import React, { useEffect, useState, useCallback, useMemo } from "react";
import StarIcon from "@mui/icons-material/Star";
import StarHalfRoundedIcon from "@mui/icons-material/StarHalfRounded";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import {
    getReviewsByProductId,
    addReview,
    updateReview,
    deleteReview,
    incrementHelpfulCount,
} from "../services/shopingService/shopService";
import { toast } from "react-toastify";

const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            stars.push(<StarIcon key={i} className="star-filled" />);
        } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
            stars.push(<StarHalfRoundedIcon key={i} className="star-half" />);
        } else {
            stars.push(<StarOutlineRoundedIcon key={i} className="star-empty" />);
        }
    }
    return <span className="rating-display">{stars}</span>;
};

export default function ProductReviews({ productId, currentUserId, navigate, averageRating }) {
    const [reviews, setReviews] = useState([]);
    const [yourRating, setYourRating] = useState(0);
    const [yourComment, setYourComment] = useState("");
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [errorReviews, setErrorReviews] = useState(null);
    const [filterRating, setFilterRating] = useState(null);

    const fetchReviews = useCallback(async () => {
        setLoadingReviews(true);
        setErrorReviews(null);
        try {
            if (productId && productId !== 'undefined') {
                const response = await getReviewsByProductId(productId);
                setReviews(Array.isArray(response.data) ? response.data : []);
            } else {
                setReviews([]);
            }
        } catch (error) {
            console.error("Lỗi khi lấy reviews:", error);
            setErrorReviews(error);
            setReviews([]);
        } finally {
            setLoadingReviews(false);
        }
    }, [productId]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const resetReviewForm = () => {
        setYourRating(0);
        setYourComment("");
        setEditingReviewId(null);
    };

    const handleAddOrUpdateReview = async () => {
        if (!currentUserId) {
            toast.warn("Vui lòng đăng nhập để gửi đánh giá.");
            navigate("/login");
            return;
        }
        if (yourRating === 0) {
            toast.warn("Vui lòng chọn số sao đánh giá.");
            return;
        }
        if (yourComment.trim() === "") {
            toast.warn("Vui lòng nhập bình luận.");
            return;
        }

        const reviewData = {
            productId: parseInt(productId),
            rating: yourRating,
            comment: yourComment,
        };

        try {
            if (editingReviewId) {
                await updateReview(editingReviewId, reviewData, currentUserId);
                toast.success("Đánh giá của bạn đã được cập nhật thành công!");
            } else {
                await addReview(reviewData, currentUserId);
                toast.success("Đánh giá của bạn đã được gửi thành công!");
            }
            resetReviewForm();
            setShowReviewForm(false);
            fetchReviews();
        } catch (error) {
            console.error("Error adding/updating review:", error);
            const errorMessage = error.response?.data?.message || "Không thể gửi/cập nhật đánh giá. Vui lòng thử lại.";
            toast.error(errorMessage);
        }
    };

    const handleEditClick = (review) => {
        setShowReviewForm(true);
        setEditingReviewId(review.id);
        setYourRating(review.rating);
        setYourComment(review.comment);
    };

    const handleDeleteClick = async (reviewId) => {
        if (!currentUserId) {
            toast.warn("Vui lòng đăng nhập để thực hiện thao tác này.");
            navigate("/login");
            return;
        }
        if (window.confirm("Bạn có chắc chắn muốn xóa đánh giá này không?")) {
            try {
                await deleteReview(reviewId, currentUserId);
                toast.success("Đánh giá đã được xóa thành công!");
                fetchReviews();
            } catch (error) {
                console.error("Error deleting review:", error);
                toast.error("Không thể xóa đánh giá. Vui lòng thử lại.");
            }
        }
    };

    const handleHelpfulClick = async (reviewId) => {
        if (!currentUserId) {
            toast.warn("Vui lòng đăng nhập để thực hiện thao tác này.");
            navigate("/login");
            return;
        }
        try {
            await incrementHelpfulCount(reviewId);
            toast.success("Đánh giá đã được đánh dấu là hữu ích!");
            fetchReviews();
        } catch (error) {
            console.error("Error incrementing helpful count:", error);
            toast.error("Không thể tăng lượt hữu ích. Vui lòng thử lại.");
        }
    };

    const ratingDistribution = useMemo(() => {
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        reviews.forEach(review => {
            const roundedRating = Math.round(review.rating);
            if (distribution[roundedRating] !== undefined) {
                distribution[roundedRating]++;
            }
        });
        return distribution;
    }, [reviews]);

    const filteredReviews = useMemo(() => {
        if (filterRating === null) {
            return reviews;
        }
        return reviews.filter(review => Math.round(review.rating) === filterRating);
    }, [reviews, filterRating]);

    if (loadingReviews) {
        return <div className="reviews-loader">Đang tải đánh giá...</div>;
    }

    if (errorReviews) {
        return <div className="reviews-error">Lỗi khi tải đánh giá: {errorReviews.message || "Vui lòng thử lại sau."}</div>;
    }

    return (
        <div className="reviewsSection">
            <h1 className="sectionTitle">Đánh giá và Bình luận</h1>
            <div className="reviewFilterSection">
                <button
                    className={`filter-button ${filterRating === null ? 'active' : ''}`}
                    onClick={() => setFilterRating(null)}
                >
                    Tất cả ({reviews.length})
                </button>
                {[5, 4, 3, 2, 1].map(star => (
                    <button
                        key={star}
                        className={`filter-button ${filterRating === star ? 'active' : ''}`}
                        onClick={() => setFilterRating(star)}
                    >
                        {star} sao ({ratingDistribution[star]})
                    </button>
                ))}
            </div>

            {currentUserId && (
                <button
                    onClick={() => {
                        setShowReviewForm(!showReviewForm);
                        if (showReviewForm) resetReviewForm();
                    }}
                    className={`write-review-button ${showReviewForm ? 'hide-cancel-review-button' : ''}`}
                >
                    {editingReviewId ? "Chỉnh sửa Đánh giá" : (showReviewForm ? "Hủy Đánh giá" : "Viết Đánh giá của bạn")}
                </button>
            )}

            {showReviewForm && (
                <div className="review-form">
                    <h4>{editingReviewId ? "Chỉnh sửa đánh giá của bạn" : "Thêm đánh giá của bạn"}</h4>
                    <div className="form-content-container">
                        <div className="review-input-group">
                            <div className="star-rating-input">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <StarIcon
                                        key={star}
                                        className={star <= yourRating ? "star-filled" : "star-empty"}
                                        onClick={() => setYourRating(star)}
                                    />
                                ))}
                            </div>
                            <textarea
                                placeholder="Viết bình luận của bạn tại đây..."
                                value={yourComment}
                                onChange={(e) => setYourComment(e.target.value)}
                                rows="4"
                            ></textarea>
                        </div>
                        <div className="form-actions">
                            <button onClick={handleAddOrUpdateReview} className="submit-review-button">
                                {editingReviewId ? "Cập nhật" : "Gửi đánh giá"}
                            </button>
                            <button onClick={() => { setShowReviewForm(false); resetReviewForm(); }} className="cancel-edit-button">
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="existing-reviews">
                {filteredReviews.length === 0 ? (
                    <p className="no-reviews-message">Chưa có đánh giá nào phù hợp.</p>
                ) : (
                    filteredReviews.map((review) => (
                        <div key={review.id} className="review-item">
                            <div className="review-header">
                                <span className="review-username">{review.username}</span>
                                <span className="review-rating-stars">{renderStars(review.rating)}</span>
                            </div>
                            <small className="review-date">
                                Đánh giá vào: {
                                review.createdAt
                                    ? new Date(review.createdAt).toLocaleDateString('vi-VN', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })
                                    : 'N/A'
                            }
                            </small>
                            <p className="review-comment-text">{review.comment}</p>
                            <div className="review-actions">
                                <button onClick={() => handleHelpfulClick(review.id)} className="helpful-button">
                                    Hữu ích ({review.helpfulCount || 0})
                                </button>
                                {currentUserId !== null && review.userId !== null && currentUserId === review.userId && (
                                    <>
                                        <button onClick={() => handleEditClick(review)} className="edit-button">Sửa
                                        </button>
                                        <button onClick={() => handleDeleteClick(review.id)}
                                                className="delete-button">Xóa
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}