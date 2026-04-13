import {
  FiInstagram,
  FiYoutube,
  FiLinkedin,
  FiTwitter,
  FiLink,
  FiGlobe,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiBarChart2,
} from 'react-icons/fi';

const ICON_MAP = {
  instagram: FiInstagram,
  youtube: FiYoutube,
  linkedin: FiLinkedin,
  twitter: FiTwitter,
  link: FiLink,
  globe: FiGlobe,
};

const ICON_COLORS = {
  instagram: 'text-pink-400 bg-pink-400/10',
  youtube: 'text-red-400 bg-red-400/10',
  linkedin: 'text-blue-400 bg-blue-400/10',
  twitter: 'text-sky-400 bg-sky-400/10',
  link: 'text-gray-400 bg-gray-400/10',
  globe: 'text-green-400 bg-green-400/10',
};

export default function LinkCard({ link, onDelete, onToggle, onEdit }) {
  const Icon = ICON_MAP[link.icon] || FiLink;
  const iconStyle = ICON_COLORS[link.icon] || ICON_COLORS.link;

  return (
    <div
      className={`group bg-gray-900 border rounded-2xl p-4 flex items-center gap-4 transition-all animate-slide-up ${
        link.isActive
          ? 'border-gray-800 hover:border-gray-600'
          : 'border-gray-800/50 opacity-50'
      }`}
    >
      {/* Icon */}
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${iconStyle}`}
      >
        <Icon size={18} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm text-white truncate">
          {link.title}
        </div>
        <div className="text-gray-500 text-xs truncate mt-0.5">{link.url}</div>
      </div>

      {/* Click count */}
      <div className="flex items-center gap-1 text-gray-500 text-xs bg-gray-800 px-2.5 py-1.5 rounded-lg">
        <FiBarChart2 size={11} />
        <span>{link.clicks}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onToggle(link._id)}
          title={link.isActive ? 'Disable' : 'Enable'}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800 transition-colors"
        >
          {link.isActive ? (
            <FiEye size={15} className="text-green-400" />
          ) : (
            <FiEyeOff size={15} className="text-gray-500" />
          )}
        </button>
        <button
          onClick={() => onEdit(link)}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
        >
          <FiEdit2 size={14} />
        </button>
        <button
          onClick={() => onDelete(link._id)}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-500/10 transition-colors text-gray-400 hover:text-red-400"
        >
          <FiTrash2 size={14} />
        </button>
      </div>
    </div>
  );
}