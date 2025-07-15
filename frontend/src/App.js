import React, { useState } from 'react';
import ResumeUpload from './components/ResumeUpload';
import FeedbackDisplay from './components/FeedbackDisplay';

const App = () => {
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (file, jobDescription) => {
    setLoading(true);
    setFeedback('');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('job_description', jobDescription);

    try {
      const response = await fetch('https://resume-reviewer-a4x3.onrender.com/feedback', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setFeedback(data.feedback);
      } else {
        setFeedback('Error: ' + (data.detail || 'Unknown error'));
      }
    } catch (err) {
      setFeedback('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <ResumeUpload onSubmit={handleSubmit} />
      <FeedbackDisplay feedback={feedback} loading={loading} />

      <footer className="text-center p-4 text-sm text-gray-400 mt-8">
  <p className="mb-2">Built by Benjamin Morka</p>
  <p className="mb-2">Connect with me:</p>
  <div className="flex justify-center space-x-4">
    <a
      href="https://github.com/BenjaminCMorka"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="GitHub"
    >
      <svg
        className="w-6 h-6 text-white hover:text-blue-400"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 0.297c-6.63 0-12 5.373-12 12 0 5.303 ... [TRIMMED FOR BREVITY]" />
      </svg>
    </a>
    <a
      href="https://linkedin.com/in/benjamin-morka/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="LinkedIn"
    >
      <svg
        className="w-6 h-6 text-white hover:text-blue-400"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.327 ... [TRIMMED FOR BREVITY]" />
      </svg>
    </a>
  </div>
</footer>
    </div>
    
  );
};

export default App;
