import { useState, useRef } from 'react';
import { FiUpload, FiX, FiCamera, FiLoader } from 'react-icons/fi';
import api from '../api/axios';

export default function ImageUpload({ currentImage, onImageUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || '');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // File size check — 5MB max
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB');
      return;
    }

    // File type check
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Only JPG, PNG, WebP allowed');
      return;
    }

    setError('');
    setUploading(true);

    // Preview dikhao
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await api.post('/upload/profile-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setPreview(res.data.imageUrl);
      onImageUploaded(res.data.imageUrl);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
      setPreview(currentImage || '');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setPreview('');
    onImageUploaded('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col items-center">

      {/* Image Preview / Upload Area */}
      <div className="relative mb-3">
        {preview ? (
          // Image preview
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-violet-500/20">
              <img
                src={preview}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Loading overlay */}
            {uploading && (
              <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
            )}
            {/* Remove button */}
            {!uploading && (
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-400 rounded-full flex items-center justify-center transition-colors shadow-lg"
              >
                <FiX size={12} className="text-white" />
              </button>
            )}
            {/* Change button */}
            {!uploading && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-7 h-7 bg-violet-600 hover:bg-violet-500 rounded-full flex items-center justify-center transition-colors shadow-lg"
              >
                <FiCamera size={13} className="text-white" />
              </button>
            )}
          </div>
        ) : (
          // Upload area
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-700 hover:border-violet-500 bg-gray-800/50 hover:bg-violet-500/5 flex flex-col items-center justify-center gap-2 transition-all group"
          >
            {uploading ? (
              <div className="w-6 h-6 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
            ) : (
              <>
                <FiUpload size={20} className="text-gray-500 group-hover:text-violet-400 transition-colors" />
                <span className="text-xs text-gray-500 group-hover:text-violet-400 transition-colors">Upload</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Upload text */}
      <p className="text-xs text-gray-500 mb-1">
        {uploading ? 'Uploading...' : 'Click to upload profile photo'}
      </p>
      <p className="text-xs text-gray-600">JPG, PNG, WebP — max 5MB</p>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
          ⚠️ {error}
        </p>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}