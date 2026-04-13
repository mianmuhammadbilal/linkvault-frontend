import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiBarChart2,
  FiLink,
  FiTrendingUp,
  FiZap,
  FiEye,
  FiEyeOff,
} from 'react-icons/fi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const ICON_COLORS = {
  instagram: '#f472b6',
  youtube: '#f87171',
  linkedin: '#60a5fa',
  twitter: '#38bdf8',
  link: '#a78bfa',
  globe: '#34d399',
};

// Custom Tooltip for chart
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-white font-semibold text-sm">{payload[0].payload.title}</p>
        <p className="text-violet-400 text-sm mt-1">
          {payload[0].value} clicks
        </p>
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) fetchAnalytics();
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      const meRes = await api.get('/auth/me');
      if (!meRes.data.profile) {
        setError('No profile found');
        setLoading(false);
        return;
      }
      const profileId = meRes.data.profile._id;
      const res = await api.get(`/links/${profileId}/analytics`);
      setAnalytics(res.data.analytics);
    } catch (err) {
      setError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="text-violet-400 hover:underline text-sm"
          >
            Go back to dashboard
          </button>
        </div>
      </div>
    );
  }

  const maxClicks = Math.max(...(analytics?.links?.map((l) => l.clicks) || [1]), 1);

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur-xl border-b border-gray-800/50 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
            >
              <FiArrowLeft size={16} />
            </button>
            <div>
              <h1 className="font-bold text-white">Analytics</h1>
              <p className="text-xs text-gray-500">Link performance overview</p>
            </div>
          </div>
          <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
            <FiBarChart2 size={16} className="text-white" />
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: 'Total Clicks',
              value: analytics?.totalClicks || 0,
              icon: <FiTrendingUp size={16} />,
              color: 'text-violet-400',
              bg: 'bg-violet-500/10 border-violet-500/20',
            },
            {
              label: 'Total Links',
              value: analytics?.totalLinks || 0,
              icon: <FiLink size={16} />,
              color: 'text-blue-400',
              bg: 'bg-blue-500/10 border-blue-500/20',
            },
            {
              label: 'Active Links',
              value: analytics?.activeLinks || 0,
              icon: <FiEye size={16} />,
              color: 'text-emerald-400',
              bg: 'bg-emerald-500/10 border-emerald-500/20',
            },
            {
              label: 'Avg Clicks',
              value: analytics?.totalLinks > 0
                ? Math.round(analytics.totalClicks / analytics.totalLinks)
                : 0,
              icon: <FiZap size={16} />,
              color: 'text-amber-400',
              bg: 'bg-amber-500/10 border-amber-500/20',
            },
          ].map((stat, i) => (
            <div key={i} className={`${stat.bg} border rounded-2xl p-4`}>
              <div className={`${stat.color} mb-2`}>{stat.icon}</div>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Top Link Banner */}
        {analytics?.topLink && analytics.topLink.clicks > 0 && (
          <div className="bg-gradient-to-r from-violet-600/20 via-purple-600/10 to-transparent border border-violet-500/20 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-violet-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <FiTrendingUp size={22} className="text-violet-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-violet-400 font-medium mb-0.5">🏆 Top Performing Link</div>
              <div className="font-bold text-white truncate">{analytics.topLink.title}</div>
            </div>
            <div className="flex-shrink-0 text-right">
              <div className="text-2xl font-bold text-violet-400">{analytics.topLink.clicks}</div>
              <div className="text-xs text-gray-500">clicks</div>
            </div>
          </div>
        )}

        {/* Bar Chart */}
        {analytics?.links?.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h2 className="font-bold text-white mb-1">Clicks Per Link</h2>
            <p className="text-gray-500 text-sm mb-5">How each link is performing</p>

            {analytics.links.every((l) => l.clicks === 0) ? (
              <div className="text-center py-10">
                <FiBarChart2 size={36} className="text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No clicks yet</p>
                <p className="text-gray-600 text-xs mt-1">Share your profile to start tracking</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={analytics.links}
                  margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis
                    dataKey="title"
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => val.length > 10 ? val.slice(0, 10) + '...' : val}
                  />
                  <YAxis
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139, 92, 246, 0.05)' }} />
                  <Bar dataKey="clicks" radius={[8, 8, 0, 0]} maxBarSize={60}>
                    {analytics.links.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={entry.clicks === maxClicks ? '#7c3aed' : '#3b2f6e'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        )}

        {/* Links Detail Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800">
            <h2 className="font-bold text-white">Link Breakdown</h2>
            <p className="text-gray-500 text-sm">Detailed stats for each link</p>
          </div>

          {analytics?.links?.length === 0 ? (
            <div className="text-center py-12">
              <FiLink size={32} className="text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No links added yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {analytics?.links?.map((link, index) => (
                <div key={link.id} className="px-5 py-4 flex items-center gap-4 hover:bg-gray-800/30 transition-colors">

                  {/* Rank */}
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    index === 0 && link.clicks > 0
                      ? 'bg-violet-600 text-white'
                      : 'bg-gray-800 text-gray-500'
                  }`}>
                    {index + 1}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-white truncate flex items-center gap-2">
                      {link.title}
                      {!link.isActive && (
                        <span className="text-xs bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full border border-gray-700 flex items-center gap-1">
                          <FiEyeOff size={9} /> Hidden
                        </span>
                      )}
                    </div>

                    {/* Progress bar */}
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-violet-600 to-purple-500 rounded-full transition-all duration-500"
                          style={{ width: `${link.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600 w-8 text-right">
                        {link.percentage}%
                      </span>
                    </div>
                  </div>

                  {/* Clicks */}
                  <div className="text-right flex-shrink-0">
                    <div className="font-bold text-white">{link.clicks}</div>
                    <div className="text-xs text-gray-500">clicks</div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Share reminder */}
        {analytics?.totalClicks === 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-center">
            <div className="text-3xl mb-3">📢</div>
            <h3 className="font-bold text-white mb-1">Share your page to get clicks!</h3>
            <p className="text-gray-500 text-sm mb-4">
              Your analytics will show up here once people start visiting your profile.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-violet-600 hover:bg-violet-500 px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
            >
              Go to Dashboard →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}