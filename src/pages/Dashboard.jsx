import { useState, useEffect } from 'react';
import {
  FiLink,
  FiBarChart2,
  FiCopy,
  FiCheck,
  FiPlus,
  FiExternalLink,
  FiUser,
  FiSettings,
  FiLogOut,
  FiZap,
  FiMenu,
} from 'react-icons/fi';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import LinkCard from '../components/LinkCard';
import SortableLinkCard from '../components/SortableLinkCard';
import LinkForm from '../components/LinkForm';
import ProfileForm from '../components/ProfileForm';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [links, setLinks] = useState([]);
  const [activeTab, setActiveTab] = useState('links');
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reordering, setReordering] = useState(false);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (user) fetchMyProfile();
  }, [user]);

 const fetchMyProfile = async () => {
  try {
    const res = await api.get('/auth/me');
    if (res.data && res.data.profile) {
      const prof = res.data.profile;
      setProfile({
        _id: prof._id || '',
        username: prof.username || '',
        fullName: prof.fullName || '',
        bio: prof.bio || '',
        profileImage: prof.profileImage || '',
        theme: prof.theme || 'dark',
      });
      fetchLinks(prof._id);
      localStorage.setItem('lv_username', prof.username);
    } else {
      setProfile(null);
      setLoading(false);
    }
  } catch (err) {
    console.error('fetchMyProfile error:', err.message);
    setProfile(null);
    setLoading(false);
  }
};

const fetchLinks = async (profileId) => {
  try {
    const res = await api.get(`/links/${profileId}`);
    if (res.data && Array.isArray(res.data.links)) {
      setLinks(res.data.links);
    } else {
      setLinks([]);
    }
  } catch (err) {
    console.error('fetchLinks error:', err.message);
    setLinks([]);
  } finally {
    setLoading(false);
  }
};

  // Drag end handler
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = links.findIndex((l) => l._id === active.id);
    const newIndex = links.findIndex((l) => l._id === over.id);

    // UI update immediately
    const newLinks = arrayMove(links, oldIndex, newIndex);
    setLinks(newLinks);

    // Backend update
    setReordering(true);
    try {
      await api.patch('/links/reorder', {
        links: newLinks.map((link, index) => ({
          id: link._id,
          order: index,
        })),
      });
    } catch {
      // Revert agar error
      setLinks(links);
    } finally {
      setReordering(false);
    }
  };

  const handleProfileSaved = (prof) => {
    setProfile(prof);
    localStorage.setItem('lv_username', prof.username);
    fetchLinks(prof._id);
    setActiveTab('links');
  };

  const handleLinkSaved = () => {
    setShowLinkForm(false);
    setEditingLink(null);
    if (profile) fetchLinks(profile._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this link?')) return;
    await api.delete(`/links/${id}`);
    setLinks(links.filter((l) => l._id !== id));
  };

  const handleToggle = async (id) => {
    const res = await api.patch(`/links/${id}/toggle`);
    setLinks(links.map((l) => (l._id === id ? res.data.link : l)));
  };

  const handleEdit = (link) => {
    setEditingLink(link);
    setShowLinkForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyLink = () => {
    const url = `${window.location.origin}/u/${profile.username}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalClicks = links.reduce((sum, l) => sum + l.clicks, 0);
  const activeLinksCount = links.filter((l) => l.isActive).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur-xl border-b border-gray-800/50 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
              <FiLink className="text-white" size={16} />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              LinkVault
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {profile && (
              <>
                
                  <a href="/analytics"
                  className="hidden sm:flex items-center gap-1.5 text-gray-400 hover:text-white text-sm px-3 py-2 rounded-lg hover:bg-gray-800/80 transition-all"
                >
                  <FiBarChart2 size={13} />
                  Analytics
                </a>
                
                 <a href={`/u/${profile.username}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden sm:flex items-center gap-1.5 text-gray-400 hover:text-white text-sm px-3 py-2 rounded-lg hover:bg-gray-800/80 transition-all"
                >
                  <FiExternalLink size={13} />
                  Preview
                </a>
                <button
                  onClick={copyLink}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    copied
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-violet-600 hover:bg-violet-500 text-white'
                  }`}
                >
                  {copied ? <><FiCheck size={13} /> Copied!</> : <><FiCopy size={13} /> Copy Link</>}
                </button>
              </>
            )}
            <button
              onClick={logout}
              title="Logout"
              className="p-2 text-gray-500 hover:text-red-400 rounded-lg hover:bg-gray-800/80 transition-all"
            >
              <FiLogOut size={15} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* No Profile */}
        {!profile && (
          <div className="animate-fade-in">
            <div className="relative bg-gradient-to-br from-violet-600/20 via-purple-600/10 to-transparent border border-violet-500/20 rounded-3xl p-8 mb-6 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-violet-400 text-sm font-medium mb-3">
                  <FiZap size={14} /> Quick Setup — 2 minutes
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  Hey {user?.name ? user.name.split(' ')[0] : 'there'}! 👋
                </h1>
                <p className="text-gray-400 text-sm leading-relaxed">
                  You're one step away! Set up your profile below.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-6">
              {['Create Profile', 'Add Links', 'Share Page'].map((step, i) => (
                <div key={i} className="flex items-center gap-2 flex-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    i === 0 ? 'bg-violet-600 text-white' : 'bg-gray-800 text-gray-500 border border-gray-700'
                  }`}>
                    {i + 1}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${i === 0 ? 'text-violet-400' : 'text-gray-600'}`}>
                    {step}
                  </span>
                  {i < 2 && <div className="flex-1 h-px bg-gray-800 hidden sm:block"></div>}
                </div>
              ))}
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
                <span className="w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center text-xs">1</span>
                Setup Your Profile
              </h2>
              <ProfileForm onSaved={handleProfileSaved} />
            </div>
          </div>
        )}

        {/* Profile Exists */}
        {profile && (
          <div className="space-y-5 animate-fade-in">

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Total Links', value: links.length, color: 'text-white', icon: <FiLink size={12} /> },
                { label: 'Active', value: activeLinksCount, color: 'text-emerald-400', icon: <FiCheck size={12} className="text-emerald-400" /> },
                { label: 'Total Clicks', value: totalClicks, color: 'text-violet-400', icon: <FiBarChart2 size={12} className="text-violet-400" /> },
              ].map((stat, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center hover:border-gray-700 transition-colors">
                  <div className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                  <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
                    {stat.icon}{stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Profile Card */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex items-center gap-4 hover:border-gray-700 transition-colors">
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-violet-500/20">
                  {profile.profileImage ? (
                    <img src={profile.profileImage} alt={profile.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xl font-bold">
                      {profile.fullName[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-gray-900"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-white">{profile.fullName}</div>
                <div className="text-gray-500 text-sm">@{profile.username}</div>
                {profile.bio && <div className="text-gray-600 text-xs mt-0.5 truncate">{profile.bio}</div>}
              </div>
              <button
                onClick={() => setActiveTab('profile')}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-xl transition-all border border-gray-700 hover:border-gray-600"
              >
                <FiSettings size={12} /> Edit
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-900/80 p-1 rounded-2xl border border-gray-800">
              {[
                { id: 'links', label: 'Links', count: links.length, icon: <FiLink size={14} /> },
                { id: 'profile', label: 'Profile', icon: <FiUser size={14} /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      activeTab === tab.id ? 'bg-white/20' : 'bg-gray-700 text-gray-400'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Links Tab */}
            {activeTab === 'links' && (
              <div className="space-y-3 animate-fade-in">

                {!showLinkForm && (
                  <button
                    onClick={() => { setEditingLink(null); setShowLinkForm(true); }}
                    className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-800 hover:border-violet-500/50 hover:bg-violet-500/5 py-4 rounded-2xl text-gray-500 hover:text-violet-400 font-medium transition-all text-sm group"
                  >
                    <div className="w-7 h-7 bg-gray-800 group-hover:bg-violet-500/20 rounded-lg flex items-center justify-center transition-all">
                      <FiPlus size={16} />
                    </div>
                    Add New Link
                  </button>
                )}

                {showLinkForm && (
                  <LinkForm
                    profileId={profile._id}
                    editLink={editingLink}
                    onSaved={handleLinkSaved}
                    onCancel={() => { setShowLinkForm(false); setEditingLink(null); }}
                  />
                )}

                {links.length === 0 && !showLinkForm && (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-gray-900 border border-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FiLink size={24} className="text-gray-600" />
                    </div>
                    <p className="font-semibold text-gray-400">No links yet</p>
                    <p className="text-sm text-gray-600 mt-1">Add your first link above</p>
                  </div>
                )}

                {/* Drag & Drop List */}
                {links.length > 0 && (
                  <div>
                    {/* Reordering indicator */}
                    {reordering && (
                      <div className="flex items-center gap-2 text-xs text-violet-400 mb-2 px-1">
                        <div className="w-3 h-3 border-2 border-violet-400/30 border-t-violet-400 rounded-full animate-spin"></div>
                        Saving order...
                      </div>
                    )}

                    {/* Drag hint */}
                    {links.length > 1 && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-3 px-1">
                        <FiMenu size={11} />
                        Drag to reorder links
                      </div>
                    )}

                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={links.map((l) => l._id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-2">
                          {links.map((link) => (
                            <SortableLinkCard
                              key={link._id}
                              link={link}
                              onDelete={handleDelete}
                              onToggle={handleToggle}
                              onEdit={handleEdit}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>
                )}

              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 animate-fade-in">
                <h3 className="font-bold mb-1 text-white">Edit Profile</h3>
                <p className="text-gray-500 text-sm mb-5">Update your public profile information</p>
                <ProfileForm existingProfile={profile} onSaved={handleProfileSaved} />
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}