import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import { FaTwitter, FaLinkedin, FaFacebook, FaWhatsapp } from "react-icons/fa";
const backendUrl = "https://blog-backend-gtx8.onrender.com" || "http://localhost:5000";
function App() {
  const [prompt, setPrompt] = useState("");
  const [blog, setBlog] = useState("");
  const [loading, setLoading] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [error, setError] = useState("");

  const generateBlog = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt.");
      return;
    }

    setError("");
    setLoading(true);
    setBlog("");
    setWordCount(0);

    try {
      const res = await axios.post(`${backendUrl}/api/generate`, { prompt });
      const content = res.data.blog;
      setBlog(content);
      setWordCount(content.trim().split(/\s+/).length);
    } catch (err) {
      setError("Failed to generate blog. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadBlog = () => {
    const blob = new Blob([blog], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "blog.txt";
    link.click();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(blog);
    alert("Copied to clipboard!");
  };

  const getShareUrl = (platform) => {
  const text = encodeURIComponent(blog);
  const url = encodeURIComponent(window.location.href); // Update with your hosted URL if available
  const fullText = `${text}%0A%0ARead more at: ${url}`;

  switch (platform) {
    case "twitter":
      return `https://twitter.com/intent/tweet?text=${text}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    case "whatsapp":
      return `https://api.whatsapp.com/send?text=${fullText}`;
    default:
      return "#";
  }
};

  return (
    <div className="main-wrapper">
      <header className="app-header">
        <h1>🧠 BlogCraft AI</h1>
        <p className="subtitle">Turn your idea into a polished blog post with one click</p>
      </header>

      <div className="input-section">
        <textarea
          rows={5}
          placeholder="Enter your blog topic or idea..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        {error && <p className="error">{error}</p>}

        <div className="buttons">
          <button onClick={generateBlog} disabled={loading}>
            {loading ? "✨ Generating..." : "Generate Blog"}
          </button>
          <button onClick={copyToClipboard} disabled={!blog}>📋 Copy</button>
          <button onClick={downloadBlog} disabled={!blog}>⬇️ Download</button>
        </div>

        {wordCount > 0 && <span className="word-count">📝 {wordCount} words</span>}

        {loading && <div className="loader">⏳ Generating blog content...</div>}
      </div>

      {blog && (
        <div className="blog-output">
          <h2>📝 Your Generated Blog</h2>
          <article className="blog-content">
            {blog.split("\n").map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </article>

          <div className="share-buttons">
  <span>🔗 Share:</span>
  <a href={getShareUrl("twitter")} target="_blank" rel="noopener noreferrer" title="Share on Twitter">
    <FaTwitter />
  </a>
  <a href={getShareUrl("linkedin")} target="_blank" rel="noopener noreferrer" title="Share on LinkedIn">
    <FaLinkedin />
  </a>
  <a href={getShareUrl("facebook")} target="_blank" rel="noopener noreferrer" title="Share on Facebook">
    <FaFacebook />
  </a>
  <a href={getShareUrl("whatsapp")} target="_blank" rel="noopener noreferrer" title="Share on WhatsApp">
    <FaWhatsapp />
  </a>
</div>
        </div>
      )}
    </div>
  );
}

export default App;
