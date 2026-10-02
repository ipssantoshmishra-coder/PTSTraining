'use client';

import React, { useState, useEffect } from 'react';
import {
  adminLogin,
  getDashboardStats,
  getAllNotices,
  createNotice,
  toggleNotice,
  deleteNotice,
  getAllFeedbacks,
  getRecruitsList,
  AdminUserSession,
  DashboardStats,
  NoticeItem,
  FeedbackItem,
} from '../lib/api';

export default function AdminPortal() {
  // Auth state
  const [session, setSession] = useState<AdminUserSession | null>(null);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'notices' | 'feedbacks' | 'recruits'>('dashboard');

  // Data States
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [recruits, setRecruits] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // New Notice Form State
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeMessage, setNoticeMessage] = useState('');
  const [noticeCategory, setNoticeCategory] = useState('Parade');
  const [publishing, setPublishing] = useState(false);

  // Search filter for recruits/feedbacks
  const [searchTerm, setSearchTerm] = useState('');

  // Persist session check on mount
  useEffect(() => {
    const saved = localStorage.getItem('pts_admin_session');
    if (saved) {
      try {
        setSession(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem('pts_admin_session');
      }
    }
  }, []);

  // Fetch data whenever user is logged in
  useEffect(() => {
    if (session) {
      loadPortalData();
    }
  }, [session]);

  const loadPortalData = async () => {
    setLoadingData(true);
    try {
      const [sData, nData, fData, rData] = await Promise.all([
        getDashboardStats().catch(() => null),
        getAllNotices().catch(() => []),
        getAllFeedbacks().catch(() => []),
        getRecruitsList().catch(() => []),
      ]);
      setStats(sData);
      setNotices(nData);
      setFeedbacks(fData);
      setRecruits(rData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      const auth = await adminLogin(loginUsername, loginPassword);
      setSession(auth);
      localStorage.setItem('pts_admin_session', JSON.stringify(auth));
    } catch (err: any) {
      setAuthError(err.message || 'Login failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setSession(null);
    localStorage.removeItem('pts_admin_session');
  };

  const handlePublishNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeMessage.trim()) return;

    setPublishing(true);
    try {
      await createNotice({
        title: noticeTitle.trim() || 'महत्वपूर्ण सूचना',
        message: noticeMessage.trim(),
        category: noticeCategory,
      });
      setNoticeTitle('');
      setNoticeMessage('');
      // Reload notices
      const updated = await getAllNotices();
      setNotices(updated);
      alert('सूचना सफलतापूर्वक प्रकाशित कर दी गई है (Notice Published)');
    } catch (e: any) {
      alert(e.message || 'Failed to publish');
    } finally {
      setPublishing(false);
    }
  };

  const handleToggleNotice = async (id: number) => {
    try {
      await toggleNotice(id);
      setNotices(notices.map((n) => (n.id === id ? { ...n, is_active: !n.is_active } : n)));
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleDeleteNotice = async (id: number) => {
    if (!confirm('Are you sure you want to permanently delete this notice?')) return;
    try {
      await deleteNotice(id);
      setNotices(notices.filter((n) => n.id !== id));
    } catch (e: any) {
      alert(e.message);
    }
  };

  // -------------------------------------------------------------
  // VIEW 1: LOGIN CARD
  // -------------------------------------------------------------
  if (!session) {
    return (
      <main className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 selection:bg-orange-500 selection:text-white">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-600/10 border border-red-500/20 text-3xl mb-3">
              🛡️
            </div>
            <h1 className="text-2xl font-black tracking-wide text-white">PTS KALPI</h1>
            <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mt-1">
              Admin & Command Portal
            </p>
          </div>

          {authError && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium text-center">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Officer Username
              </label>
              <input
                type="text"
                required
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="e.g. principal_pts"
                className="w-full bg-slate-800/80 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Security Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-800/80 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-slate-500"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-4 rounded-xl transition duration-200 shadow-lg shadow-red-900/30 text-sm tracking-wide disabled:opacity-50"
            >
              {authLoading ? 'Verifying Credentials...' : 'SECURE LOGIN'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-6">
            Authorized Police Personnel Only • Uttar Pradesh Police
          </p>
        </div>
      </main>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: AUTHENTICATED COMMAND CENTER
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header Bar */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 px-6 py-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🛡️</span>
          <div>
            <h1 className="text-lg font-black text-white leading-none">PTS KALPI CONTROL DESK</h1>
            <p className="text-xs text-slate-400 mt-1">Police Training School Administration</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-white">{session.full_name}</p>
            <span className="inline-block bg-orange-500/10 text-orange-400 border border-orange-500/30 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">
              {session.role}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-600/90 hover:bg-red-600 text-white text-xs font-extrabold px-3.5 py-2 rounded-lg transition"
          >
            LOGOUT
          </button>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-slate-900/50 border-r border-slate-800 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition ${
              activeTab === 'dashboard'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>📊</span> Dashboard Overview
          </button>

          <button
            onClick={() => setActiveTab('notices')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition ${
              activeTab === 'notices'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>📢</span> Notice Broadcaster
          </button>

          <button
            onClick={() => setActiveTab('feedbacks')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition ${
              activeTab === 'feedbacks'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>💬</span> Feedback Desk
          </button>

          <button
            onClick={() => setActiveTab('recruits')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition ${
              activeTab === 'recruits'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>👮</span> Trainee Roster ({recruits.length || 193})
          </button>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 max-w-7xl overflow-y-auto">
          {/* ----------------- TAB 1: DASHBOARD OVERVIEW ----------------- */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="text-xl font-black text-white">Live Training School KPIs</h2>

              {/* KPI Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <p className="text-xs font-bold uppercase text-slate-400">Total Recruits</p>
                  <p className="text-3xl font-black text-blue-400 mt-2">{stats?.total_recruits || recruits.length || 193}</p>
                  <p className="text-xs text-slate-500 mt-1">Enrolled & Active</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <p className="text-xs font-bold uppercase text-slate-400">Active Notices</p>
                  <p className="text-3xl font-black text-red-500 mt-2">{stats?.active_notices || notices.filter(n => n.is_active).length}</p>
                  <p className="text-xs text-slate-500 mt-1">Broadcasted on App</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <p className="text-xs font-bold uppercase text-slate-400">Feedbacks Received</p>
                  <p className="text-3xl font-black text-emerald-400 mt-2">{stats?.total_feedbacks || feedbacks.length}</p>
                  <p className="text-xs text-slate-500 mt-1">From Recruits</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <p className="text-xs font-bold uppercase text-slate-400">System Status</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-base font-bold text-emerald-400">Operational</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Render + Supabase Live</p>
                </div>
              </div>

              {/* Quick Preview of Latest Notice */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-orange-400 mb-3">
                  Current Notice on Recruits Screen
                </h3>
                {notices.length > 0 ? (
                  <div className="bg-red-950/20 border-l-4 border-red-500 p-4 rounded-r-xl">
                    <p className="text-white font-medium">{notices[0].message || notices[0].title}</p>
                    <p className="text-xs text-red-400/80 mt-2">
                      Category: {notices[0].category} • Posted: {new Date(notices[0].created_at).toLocaleString('en-IN')}
                    </p>
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">No notices currently published.</p>
                )}
              </div>
            </div>
          )}

          {/* ----------------- TAB 2: NOTICE BROADCASTER ----------------- */}
          {activeTab === 'notices' && (
            <div className="space-y-6">
              <h2 className="text-xl font-black text-white">Notice Board Management</h2>

              {/* Notice Creation Box */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-orange-400 mb-4">
                  + Publish New Announcement
                </h3>

                <form onSubmit={handlePublishNotice} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                        Notice Heading (Optional)
                      </label>
                      <input
                        type="text"
                        value={noticeTitle}
                        onChange={(e) => setNoticeTitle(e.target.value)}
                        placeholder="e.g. विशेष परेड अभ्यास / वर्दी वितरण"
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                        Category
                      </label>
                      <select
                        value={noticeCategory}
                        onChange={(e) => setNoticeCategory(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="Parade">परेड (Parade)</option>
                        <option value="Exam">परीक्षा (Exam)</option>
                        <option value="Mess">मेस (Mess)</option>
                        <option value="General">सामान्य आदेश (General)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      Detailed Message (Recruits will see this in the app)
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={noticeMessage}
                      onChange={(e) => setNoticeMessage(e.target.value)}
                      placeholder="समस्त रिक्रूट आरक्षी कल प्रातः 06:00 बजे..."
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={publishing}
                    className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition shadow-lg shadow-red-900/30 disabled:opacity-50"
                  >
                    {publishing ? 'Publishing...' : 'BROADCAST NOTICE'}
                  </button>
                </form>
              </div>

              {/* Published Notices Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">All Notices History</h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-800/60 text-xs uppercase text-slate-400 font-bold">
                      <tr>
                        <th className="p-4">#</th>
                        <th className="p-4">Message</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {notices.map((n, idx) => (
                        <tr key={n.id} className="hover:bg-slate-800/40">
                          <td className="p-4 font-mono text-xs text-slate-500">{idx + 1}</td>
                          <td className="p-4 font-medium max-w-md text-white">{n.message || n.title}</td>
                          <td className="p-4">
                            <span className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded">
                              {n.category}
                            </span>
                          </td>
                          <td className="p-4 text-xs text-slate-400">
                            {new Date(n.created_at).toLocaleString('en-IN')}
                          </td>
                          <td className="p-4">
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                                n.is_active
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-slate-700/50 text-slate-400'
                              }`}
                            >
                              {n.is_active ? 'Active' : 'Archived'}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => handleToggleNotice(n.id)}
                              className="text-xs font-bold text-amber-400 hover:underline"
                            >
                              {n.is_active ? 'Archive' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleDeleteNotice(n.id)}
                              className="text-xs font-bold text-red-500 hover:underline"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ----------------- TAB 3: FEEDBACK DESK ----------------- */}
          {activeTab === 'feedbacks' && (
            <div className="space-y-6">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <h2 className="text-xl font-black text-white">Recruit Feedbacks ({feedbacks.length})</h2>
                <input
                  type="text"
                  placeholder="Filter by roll number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {feedbacks
                  .filter((f) => !searchTerm || f.roll_number.includes(searchTerm))
                  .map((item) => (
                    <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-white">{item.recruit_name || 'Trainee'}</p>
                          <p className="text-xs font-mono text-orange-400">Roll No: {item.roll_number}</p>
                        </div>
                        <span className="text-[11px] text-slate-500">
                          {new Date(item.created_at).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                        {item.feedback_text}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ----------------- TAB 4: RECRUITS ROSTER ----------------- */}
          {activeTab === 'recruits' && (
            <div className="space-y-6">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <h2 className="text-xl font-black text-white">Enrolled Recruits Roster ({recruits.length})</h2>
                <input
                  type="text"
                  placeholder="Search name, roll no, district..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-800/60 text-xs uppercase text-slate-400 font-bold">
                      <tr>
                        <th className="p-4">Roll No</th>
                        <th className="p-4">Name</th>
                        <th className="p-4">District</th>
                        <th className="p-4">Hostel / Bed</th>
                        <th className="p-4">Indoor Batch</th>
                        <th className="p-4">Company / Platoon</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {recruits
                        .filter(
                          (r) =>
                            !searchTerm ||
                            r.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            r.roll_number?.includes(searchTerm) ||
                            r.home_district?.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .slice(0, 50)
                        .map((r) => (
                          <tr key={r.id || r.roll_number} className="hover:bg-slate-800/40">
                            <td className="p-4 font-mono font-bold text-white">{r.roll_number}</td>
                            <td className="p-4 font-semibold text-orange-400">{r.full_name}</td>
                            <td className="p-4 text-xs">{r.home_district}</td>
                            <td className="p-4 text-xs">
                              {r.hostel_name || 'Hostel'} - Bed {r.bed_no || 'N/A'}
                            </td>
                            <td className="p-4 text-xs">Batch {r.indoor_batch_no || 'N/A'}</td>
                            <td className="p-4 text-xs">
                              {r.outdoor_company} - Plt {r.outdoor_platoon}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}