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

      
    </div>
    
  );
};

export default App;
