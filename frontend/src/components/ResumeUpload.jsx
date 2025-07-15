import React, { useState } from 'react';
import { Upload, FileText, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';

const ResumeUpload = ({ onSubmit }) => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setErrors(prev => ({ ...prev, file: null }));
      } else {
        setErrors(prev => ({ ...prev, file: 'Please upload a PDF file' }));
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        setErrors(prev => ({ ...prev, file: null }));
      } else {
        setErrors(prev => ({ ...prev, file: 'Please upload a PDF file' }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!file) newErrors.file = 'Please upload a resume';
    if (!jobDescription.trim()) newErrors.jobDescription = 'Please enter a job description';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    
    try {
      await onSubmit(file, jobDescription);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Resume <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Optimizer</span>
          </h1>
          <p className="text-gray-300 text-lg">Get AI-powered feedback to match your dream job</p>
        </div>

        {/* Main Form */}
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
            
            {/* File Upload Area */}
            <div className="mb-8">
              <label className="block text-white font-semibold mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Upload Your Resume
              </label>
              
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  isDragging
                    ? 'border-blue-400 bg-blue-400/10 scale-105'
                    : errors.file
                    ? 'border-red-400 bg-red-400/10'
                    : file
                    ? 'border-green-400 bg-green-400/10'
                    : 'border-gray-400 bg-gray-400/10 hover:border-blue-400 hover:bg-blue-400/10'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                {file ? (
                  <div className="flex items-center justify-center gap-3">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                    <div className="text-left">
                      <p className="text-white font-medium">{file.name}</p>
                      <p className="text-gray-400 text-sm">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload className={`w-12 h-12 mx-auto transition-colors ${
                      isDragging ? 'text-blue-400' : 'text-gray-400'
                    }`} />
                    <div>
                      <p className="text-white font-medium">Drop your resume here or click to browse</p>
                      <p className="text-gray-400 text-sm">PDF files only, up to 10MB</p>
                    </div>
                  </div>
                )}
              </div>
              
              {errors.file && (
                <div className="mt-2 flex items-center gap-2 text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{errors.file}</span>
                </div>
              )}
            </div>

           
            <div className="mb-8">
              <label className="block text-white font-semibold mb-3">
                Job Description
              </label>
              <div className="relative">
                <textarea
                  placeholder="Paste the job description here... Include required skills, qualifications, and responsibilities for the best feedback."
                  value={jobDescription}
                  onChange={(e) => {
                    setJobDescription(e.target.value);
                    if (errors.jobDescription) {
                      setErrors(prev => ({ ...prev, jobDescription: null }));
                    }
                  }}
                  rows={8}
                  className={`w-full bg-white/10 backdrop-blur-sm border rounded-xl p-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 transition-all duration-300 ${
                    errors.jobDescription
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-white/30 focus:border-blue-400 focus:ring-blue-400'
                  }`}
                />
                <div className="absolute bottom-3 right-3 text-gray-400 text-xs">
                  {jobDescription.length} characters
                </div>
              </div>
              
              {errors.jobDescription && (
                <div className="mt-2 flex items-center gap-2 text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{errors.jobDescription}</span>
                </div>
              )}
            </div>

            
            <button
              type="submit"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className={`w-full relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                isSubmitting 
                  ? 'opacity-70 cursor-not-allowed' 
                  : 'hover:from-blue-600 hover:to-purple-700 hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-105'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Analyzing Resume...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <Sparkles className="w-5 h-5" />
                  Get AI Feedback
                </div>
              )}
              
           
              <div className="absolute inset-0 -top-1 -bottom-1 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
            </button>
          </div>

         
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <FileText className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-white font-medium text-sm">AI-Powered Analysis</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-white font-medium text-sm">Personalized Feedback</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-white font-medium text-sm">Instant Results</p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default ResumeUpload;