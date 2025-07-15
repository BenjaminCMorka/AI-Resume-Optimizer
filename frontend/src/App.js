import React, { useState } from 'react';
import ResumeUpload from './components/ResumeUpload';
import FeedbackDisplay from './components/FeedbackDisplay';
import { SocialIcon } from 'react-social-icons';

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

      <footer className="text-white py-6 text-center">
        <p className="text-lg mb-2">Connect with me</p>
        <div className="space-x-8">
          <SocialIcon
            url="https://github.com/BenjaminCMorka"
            target="_blank"
            rel="noopener noreferrer"
            bgColor="#ffffff"
            fgColor="#000000"
            style={{ height: 40, width: 40 }}
          />
          <SocialIcon
            url="https://linkedin.com/in/benjamin-morka"
            target="_blank"
            rel="noopener noreferrer"
            bgColor="#ffffff"
            fgColor="#0A66C2"
            style={{ height: 40, width: 40 }}
          />
        </div>
      </footer>


    </div>
    
  );
};

export default App;
