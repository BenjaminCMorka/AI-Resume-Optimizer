import React from 'react';

const FeedbackDisplay = ({ feedback, loading }) => {
  if (!feedback) return null;

  return (
    <div className="p-6 bg-white shadow-xl rounded-xl max-w-2xl mx-auto mt-8">
  <h2 className="text-2xl font-bold mb-3 text-gray-800">Feedback</h2>
  <p className="text-gray-700 whitespace-pre-line">{feedback}</p>
</div>

  );
};

export default FeedbackDisplay;
