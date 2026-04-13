import { useState, useEffect } from 'react';
import {
  FiInstagram,
  FiYoutube,
  FiLinkedin,
  FiTwitter,
  FiLink,
  FiGlobe,
} from 'react-icons/fi';
import api from '../api/axios';

const ICON_OPTIONS = [
  { value: 'link', label: 'Link', Icon: FiLink },
  { value: 'instagram', label: 'Instagram', Icon: FiInstagram },
  { value: 'youtube', label: 'YouTube', Icon: FiYoutube },
  { value: 'linkedin', label: 'LinkedIn', Icon: FiLinkedin },
  { value: 'twitter', label: 'Twitter', Icon: FiTwitter },
  { value: 'globe', label: 'Website', Icon: FiGlobe },
];

export default function LinkForm({ profileId, editLink, onSaved, onCancel }) {
  const [form, setForm] = useState({
    title: '',
    url: '',
    icon: 'link',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editLink) {
      setForm({
        title: editLink.title,
        url: editLink.url,
        icon: editLink.icon || 'link',
      });
    }
  }, [editLink]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (editLink) {
        await api.put(`/links/${editLink._id}`, form);
      } else {
        await api.post('/links', { ...form, profileId });
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.error || 'Error saving link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/50 border border-violet-500/40 rounded-2xl p-5 animate-fade-in">
      <h3 className="font-semibold mb-4 text-violet-300 text-sm uppercase tracking-wider">
        {editLink ? '✏️ Edit Link' : '➕ Add New Link'}
      </h3>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-2 rounded-lg text-sm mb-3">
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Link Title (e.g. My YouTube Channel)"
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500 transition-colors text-sm placeholder-gray-600"
          required
        />

        <input
          type="url"
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          placeholder="https://..."
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500 transition-colors text-sm placeholder-gray-600"
          required
        />

        {/* Icon Selector */}
        <div>
          <label className="block text-xs text-gray-500 mb-2">
            Choose Icon
          </label>
          <div className="flex gap-2 flex-wrap">
            {ICON_OPTIONS.map(({ value, label, Icon }) => (
              <button
                key={value}
                type="button"
                title={label}
                onClick={() => setForm({ ...form, icon: value })}
                className={`flex flex-col items-center gap-1 p-2.5 rounded-xl transition-all border text-xs ${
                  form.icon === value
                    ? 'border-violet-500 bg-violet-500/20 text-violet-300'
                    : 'border-gray-700 text-gray-400 hover:border-gray-500'
                }`}
              >
                <Icon size={16} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl text-sm border border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 rounded-xl text-sm bg-violet-600 hover:bg-violet-500 font-semibold transition-all disabled:opacity-50"
          >
            {loading ? '⏳ Saving...' : editLink ? '💾 Update' : '➕ Add Link'}
          </button>
        </div>
      </form>
    </div>
  );
}