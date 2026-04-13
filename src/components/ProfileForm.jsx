import { useState } from 'react';
import api from '../api/axios';
import ImageUpload from './ImageUpload';

export default function ProfileForm({ existingProfile, onSaved }) {
  const [form, setForm] = useState({
    username: existingProfile?.username || '',
    fullName: existingProfile?.fullName || '',
    bio: existingProfile?.bio || '',
    profileImage: existingProfile?.profileImage || '',
    theme: existingProfile?.theme || 'dark',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let res;
      if (existingProfile) {
        res = await api.put(`/profile/${existingProfile.username}`, form);
      } else {
        res = await api.post('/profile', form);
      }
      onSaved(res.data.profile);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          ⚠️ {error}
        </div>
      )}

      {/* Image Upload */}
      <div className="flex flex-col items-center py-2">
        <ImageUpload
          currentImage={form.profileImage}
          onImageUploaded={(url) => setForm({ ...form, profileImage: url })}
        />
      </div>

      {/* Username */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1.5">
          Username *
        </label>
        <div className="flex items-center bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden focus-within:border-violet-500 transition-colors">
          <span className="px-3 text-gray-600 text-xs border-r border-gray-700 py-3 whitespace-nowrap">
            linkvault/u/
          </span>
          <input
            type="text"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
            placeholder="yourname"
            disabled={!!existingProfile}
            className="flex-1 bg-transparent px-3 py-3 text-white outline-none text-sm disabled:opacity-40 placeholder-gray-600"
            required
          />
        </div>
      </div>

      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1.5">
          Full Name *
        </label>
        <input
          type="text"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          placeholder="Your Full Name"
          className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500 transition-colors text-sm placeholder-gray-600"
          required
        />
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1.5">
          Bio
        </label>
        <textarea
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          placeholder="Tell people about yourself..."
          rows={3}
          maxLength={200}
          className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500 transition-colors text-sm resize-none placeholder-gray-600"
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-600">Short description of yourself</span>
          <span className="text-xs text-gray-600">{form.bio.length}/200</span>
        </div>
      </div>

      {/* Theme */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Page Theme
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 'dark', label: 'Dark', emoji: '🌙', desc: 'Sleek black' },
            { value: 'light', label: 'Light', emoji: '☀️', desc: 'Clean white' },
            { value: 'gradient', label: 'Gradient', emoji: '✨', desc: 'Purple vibe' },
          ].map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setForm({ ...form, theme: t.value })}
              className={`py-3 px-2 rounded-xl text-sm transition-all border flex flex-col items-center gap-1 ${
                form.theme === t.value
                  ? 'border-violet-500 bg-violet-500/10 text-violet-300'
                  : 'border-gray-700 text-gray-400 hover:border-gray-600'
              }`}
            >
              <span className="text-lg">{t.emoji}</span>
              <span className="font-medium text-xs">{t.label}</span>
              <span className="text-xs opacity-60">{t.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed py-3.5 rounded-xl font-semibold transition-all text-sm shadow-lg shadow-violet-500/20"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Saving...
          </span>
        ) : existingProfile ? '💾 Save Changes' : '🚀 Create My Profile'}
      </button>

    </form>
  );
}