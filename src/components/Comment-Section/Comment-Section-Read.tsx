import React from "react";

const CommentSectionRead: React.FC<{review_comment: string, status: string}> = ({review_comment, status}) => {
    return(
        <div className="comment-section">
            <div className="status-buttons">
                <div className={`status-button ${status === "approved" ? "approved" : "rejected"}` } style={{cursor: 'auto'}}>
                    {status === "approved" ? "Прифатена" : "Отфрлена"}
                </div>
            </div>
            {review_comment.length > 2 && (
                <div className="comment-box">
                    <label>Коментар:</label>
                    <input
                    placeholder="Write a comment..."
                    value={review_comment}
                    readOnly
                    style={{cursor: 'auto', width: '100%'}}
                    />
                </div>
            )}
        </div>
    )
}

export default CommentSectionRead;