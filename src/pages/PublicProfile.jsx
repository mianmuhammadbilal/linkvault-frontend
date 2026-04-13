import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  FiInstagram,
  FiYoutube,
  FiLinkedin,
  FiTwitter,
  FiLink,
  FiGlobe,
  FiExternalLink,
} from 'react-icons/fi';
import api from '../api/axios';

const ICON_MAP = {
  instagram: FiInstagram,
  youtube: FiYoutube,
  linkedin: FiLinkedin,
  twitter: FiTwitter,
  link: FiLink,
  globe: FiGlobe,
};

const ICON_COLORS = {
  instagram: 'text-pink-400 bg-pink-400/10 border-pink-400/20',
  youtube: 'text-red-400 bg-red-400/10 border-red-400/20',
  linkedin: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  twitter: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
  link: 'text-gray-400 bg-gray-400/10 border-gray-400/20',
  globe: 'text-green-400 bg-green-400/10 border-green-400/20',
};

const THEMES = {
  dark: {
    bg: 'bg-gray-950',
    card: 'bg-gray-900 border border-gray-800 hover:border-gray-600 hover:bg-gray-800/80',
    cardActive: 'shadow-lg shadow-black/20',
    text: 'text-white',
    sub: 'text-gray-400',
    bio: 'text-gray-400',
    footer: 'text-gray-700',
    footerLink: 'text-violet-500 hover:text-violet-400',
    badge: 'bg-gray-800 text-gray-400 border border-gray-700',
  },
  light: {
    bg: 'bg-slate-50',
    card: 'bg-white border border-slate-200 hover:border-violet-300 hover:shadow-md',
    cardActive: 'shadow-sm',
    text: 'text-slate-900',
    sub: 'text-slate-500',
    bio: 'text-slate-500',
    footer: 'text-slate-300',
    footerLink: 'text-violet-500 hover:text-violet-600',
    badge: 'bg-slate-100 text-slate-500 border border-slate-200',
  },
  gradient: {
    bg: 'bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950',
    card: 'bg-white/10 border border-white/15 hover:border-white/35 hover:bg-white/15 backdrop-blur-md',
    cardActive: 'shadow-lg shadow-black/20',
    text: 'text-white',
    sub: 'text-white/60',
    bio: 'text-white/60',
    footer: 'text-white/20',
    footerLink: 'text-violet-300 hover:text-violet-200',
    badge: 'bg-white/10 text-white/60 border border-white/15 backdrop-blur-sm',
  },
};

export default function PublicProfile() {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [clickedId, setClickedId] = useState(null);

  useEffect(() => {
    api
      .get(`/profile/${username}`)
      .then((res) => setData(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [username]);

  const handleLinkClick = async (link) => {
    setClickedId(link._id);
    try {
      await api.patch(`/links/${link._id}/click`);
    } catch {}
    setTimeout(() => {
      window.open(link.url, '_blank', 'noopener,noreferrer');
      setClickedId(null);
    }, 150);
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Not found
  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white px-4">
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 bg-gray-900 border border-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <FiLink size={36} className="text-gray-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Page not found</h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            <span className="text-violet-400">@{username}</span> hasn't created their LinkVault page yet.
          </p>
          
            <a href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 px-6 py-3 rounded-xl font-semibold transition-all text-sm shadow-lg shadow-violet-500/25"
          >
            Create your free page →
          </a>
        </div>
      </div>
    );
  }

  const { profile, links } = data;
  const theme = THEMES[profile.theme] || THEMES.dark;

  return (
    <div className={`min-h-screen ${theme.bg} py-12 px-4`}>
      <div className="max-w-sm mx-auto">

        {/* Profile Header */}
        <div className="flex flex-col items-center mb-8 animate-fade-in">

          {/* Avatar */}
          <div className="relative mb-4">
            <div className="w-28 h-28 rounded-3xl overflow-hidden ring-4 ring-violet-500/20 shadow-2xl shadow-violet-500/10">
              {profile.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt={profile.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 flex items-center justify-center text-4xl font-bold text-white">
                  {profile.fullName[0].toUpperCase()}
                </div>
              )}
            </div>
            {/* Online dot */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-current shadow-lg"></div>
          </div>

          {/* Name */}
          <h1 className={`text-2xl font-bold ${theme.text} text-center`}>
            {profile.fullName}
          </h1>

          {/* Username badge */}
          <div className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${theme.badge}`}>
            @{profile.username}
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className={`text-sm ${theme.bio} text-center mt-3 max-w-xs leading-relaxed`}>
              {profile.bio}
            </p>
          )}

          {/* Stats */}
          <div className={`flex items-center gap-1 mt-4 text-xs ${theme.sub}`}>
            <FiLink size={11} />
            <span>{links.length} link{links.length !== 1 ? 's' : ''}</span>
          </div>

        </div>

        {/* Links */}
        <div className="space-y-3 animate-slide-up">
          {links.length === 0 && (
            <div className={`text-center py-12 ${theme.sub} text-sm`}>
              No links added yet.
            </div>
          )}

          {links.map((link, index) => {
            const Icon = ICON_MAP[link.icon] || FiLink;
            const iconStyle = ICON_COLORS[link.icon] || ICON_COLORS.link;
            const isClicked = clickedId === link._id;

            return (
              <button
                key={link._id}
                onClick={() => handleLinkClick(link)}
                style={{ animationDelay: `${index * 50}ms` }}
                className={`w-full ${theme.card} ${theme.cardActive} rounded-2xl px-4 py-3.5 flex items-center gap-4 transition-all duration-200 cursor-pointer group ${
                  isClicked ? 'scale-95 opacity-75' : 'hover:scale-[1.01]'
                }`}
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${iconStyle}`}>
                  <Icon size={17} />
                </div>

                {/* Title */}
                <span className={`flex-1 text-left font-semibold text-sm ${theme.text}`}>
                  {link.title}
                </span>

                {/* Arrow */}
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                  isClicked
                    ? 'bg-violet-500 text-white'
                    : `${theme.sub} opacity-0 group-hover:opacity-100`
                }`}>
                  <FiExternalLink size={13} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className={`text-center mt-12 pb-4`}>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${theme.badge} text-xs`}>
            <FiLink size={11} />
            <span className={theme.footer}>Powered by</span>
            <a href="/" className={`${theme.footerLink} font-semibold transition-colors`}>
              LinkVault
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}