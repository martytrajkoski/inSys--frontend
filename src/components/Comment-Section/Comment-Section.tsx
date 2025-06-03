import { useEffect, useState } from "react";
import axiosClient from "../../axiosClient/axiosClient";
import type { CommentProp } from "../../types/types";

const CommentSection = ({  brFaktura, endpoint, initialStatus, initialComment }: CommentProp) => {
  const [status, setStatus] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (initialStatus) setStatus(initialStatus);
    if (initialComment) setComment(initialComment);
  }, [initialStatus, initialComment]);


  const handleSubmit = async () => {
  setLoading(true);
  setMessage("");
  try {
    await axiosClient.patch(`${endpoint}/${brFaktura}`, {
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
