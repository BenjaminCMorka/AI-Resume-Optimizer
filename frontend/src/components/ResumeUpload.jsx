import React, { useState } from 'react';

const ResumeUpload = ({ onSubmit }) => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file || !jobDescription.trim()) {
      alert('Please upload a file and enter a job description.');
      return;
    }
    onSubmit(file, jobDescription);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-8 bg-white shadow-xl rounded-xl max-w-lg mx-auto mt-8">
  <input
    type="file"
    accept="application/pdf"
    onChange={handleFileChange}
    className="border border-gray-300 rounded-lg p-2"
  />
  <textarea
    placeholder="Paste job description here..."
    value={jobDescription}
    onChange={(e) => setJobDescription(e.target.value)}
    rows={6}
    className="border border-gray-300 rounded-lg p-3 resize-none"
  />
  <button
    type="submit"
    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
  >
    Submit Resume
  </button>
</form>

  );
};

export default ResumeUpload;
