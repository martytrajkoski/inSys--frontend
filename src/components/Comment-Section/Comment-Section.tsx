import { useEffect, useState } from "react";
import axiosClient from "../../axiosClient/axiosClient";
import type { CommentProp } from "../../types/types";

const CommentSection = ({ brFaktura, endpoint, initialStatus, initialComment }: CommentProp) => {
  // Initialize from localStorage first, then from initial props, else empty string
  const [status, setStatus] = useState<string>(() => {
    return localStorage.getItem("commentStatus") || initialStatus || "";
  });
  const [comment, setComment] = useState<string>(() => {
    return localStorage.getItem("commentText") || initialComment || "";
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  // Update localStorage whenever status changes
  useEffect(() => {
    if (status) localStorage.setItem("commentStatus", status);
  }, [status]);

  // Update localStorage whenever comment changes
  useEffect(() => {
    if (comment) localStorage.setItem("commentText", comment);
  }, [comment]);

  // Keep initial props in sync only if localStorage is empty (optional)
  useEffect(() => {
    if (!localStorage.getItem("commentStatus") && initialStatus) setStatus(initialStatus);
    if (!localStorage.getItem("commentText") && initialComment) setComment(initialComment);
  }, [initialStatus, initialComment]);

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");
    try {
      await axiosClient.patch(`${endpoint}`, {
        br_faktura: brFaktura,
        status: status,
        review_comment: comment,
      });
      if (status === "approved") {
        setMessage("Approved Successfully.");
      } else if (status === "rejected") {
        setMessage("Rejected Successfully.");
      } else {
        setMessage("Updated Successfully.");
      }
      // Optional: Clear localStorage after successful submit if you want to reset state
      localStorage.removeItem("commentStatus");
      localStorage.removeItem("commentText");
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
          Approved
        </div>
        <div
          className={`status-button ${status === "rejected" ? "rejected" : ""}`}
          onClick={() => setStatus("rejected")}
        >
          Rejected
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

      <div className="comment-button-submit">
        <button
          className="submit-button"
          onClick={handleSubmit}
          disabled={loading || !status}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>

        {message && <div className="feedback-message">{message}</div>}
      </div>
    </div>
  );
};

export default CommentSection;
