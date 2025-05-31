import { useState } from "react";
import axiosClient from "../../axiosClient/axiosClient";
import type { CommentProp } from "../../types/types";

const CommentSection = ({  brFaktura, endpoint, initialStatus, initialComment }: CommentProp) => {
  const [status, setStatus] = useState(initialStatus);
  const [comment, setComment] = useState(initialComment);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await axiosClient.patch(`${endpoint}/${brFaktura}`, {
        br_faktura: brFaktura,
        status,
        review_comment: comment,
      });

      setMessage(res.data.message || "Updated successfully.");
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comment-section">

      <div className="status-buttons">
        <div
          className={`status-button ${status === "approved" ? "approved" : ""}`}
          onClick={() => setStatus("approved")}
        >
          Approve
        </div>
        <div
          className={`status-button ${status === "rejected" ? "rejected" : ""}`}
          onClick={() => setStatus("rejected")}
        >
          Reject
        </div>
      </div>

      <div className="comment-box">
        <textarea
          rows={4}
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <button
        className="submit-button"
        onClick={handleSubmit}
        disabled={loading || !status}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>

      {message && <div className="feedback-message">{message}</div>}
    </div>
  );
};

export default CommentSection;
