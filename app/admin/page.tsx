'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import YachiyoSidebar from '@/components/YachiyoSidebar';
import {
  getLocalVibes,
  getActiveUser,
  setActiveUser,
  deleteVibeLocal,
  toggleFeatureVibeLocal,
} from '@/lib/storage';
import { MOCK_PROFILES } from '@/lib/mock-data';
import { Vibe, Profile, UserRole } from '@/types';
import Link from 'next/link';

export default function AdminPage() {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [vibes, setVibes] = useState<Vibe[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [activeTab, setActiveTab] = useState<'analytics' | 'content' | 'users'>('analytics');

  useEffect(() => {
    setCurrentUser(getActiveUser());
    setVibes(getLocalVibes());

    const storedUsers = localStorage.getItem('vibeui_users');
    if (storedUsers) {
      try {
        setUsers(JSON.parse(storedUsers));
      } catch {
        setUsers(MOCK_PROFILES);
      }
    } else {
      setUsers(MOCK_PROFILES);
      localStorage.setItem('vibeui_users', JSON.stringify(MOCK_PROFILES));
    }
  }, []);

  const saveUsersState = (updatedUsers: Profile[]) => {
    setUsers(updatedUsers);
    localStorage.setItem('vibeui_users', JSON.stringify(updatedUsers));
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    const updated = users.map((u) => (u.id === userId ? { ...u, role: newRole } : u));
    saveUsersState(updated);
    if (currentUser?.id === userId) {
      const updatedCurrent = { ...currentUser, role: newRole };
      setCurrentUser(updatedCurrent);
      setActiveUser(updatedCurrent);
    }
  };

  const handleBanToggle = (userId: string) => {
    const updated = users.map((u) =>
      u.id === userId ? { ...u, is_banned: !u.is_banned } : u
    );
    saveUsersState(updated);
  };

  const handleDeleteVibe = (vibeId: string) => {
    if (confirm('Are you sure you want to delete this artifact?')) {
      deleteVibeLocal(vibeId);
      setVibes(getLocalVibes());
    }
  };

  const handleToggleFeature = (vibeId: string) => {
    toggleFeatureVibeLocal(vibeId);
    setVibes(getLocalVibes());
  };

  const handleSwitchToAdmin = () => {
    const adminUser = MOCK_PROFILES.find((p) => p.role === 'admin') || MOCK_PROFILES[0];
    setActiveUser(adminUser);
    setCurrentUser(adminUser);
  };

  const totalStars = vibes.reduce((acc, v) => acc + v.star_count, 0);

  return (
    <div className="yachiyo-container">
      <YachiyoSidebar />

      <main className="yachiyo-main-content space-y-4 text-xs">
        {/* Admin Header */}
        <div className="bg-[#E6F4F7] border-2 border-[#487A8A] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="font-bold text-sm text-[#224466]">
              ◆ VIBE UI // WEBMASTER CONTROL PANEL
            </div>
            <div className="text-[11px] text-[#555]">
              Curate featured projects, manage member roles, and monitor repository health.
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-white border border-[#487A8A] px-2 py-1 text-[11px]">
            <span>Operator: <strong>@{currentUser?.username}</strong></span>
            <span className="bg-[#cc9966]/20 text-[#D26432] px-1 font-bold">
              [{currentUser?.role}]
            </span>
            {currentUser?.role !== 'admin' && (
              <button
                onClick={handleSwitchToAdmin}
                className="bg-[#FF7733] text-white px-2 py-0.5 text-[10px] font-bold cursor-pointer"
              >
                Switch to Admin
              </button>
            )}
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center space-x-1 border-b-2 border-[#487A8A] pb-1 text-[11px]">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1 border font-bold cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-[#487A8A] text-white border-[#487A8A]'
                : 'bg-white text-[#333] border-[#ccc]'
            }`}
          >
            01. SYSTEM ANALYTICS
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`px-3 py-1 border font-bold cursor-pointer ${
              activeTab === 'content'
                ? 'bg-[#487A8A] text-white border-[#487A8A]'
                : 'bg-white text-[#333] border-[#ccc]'
            }`}
          >
            02. CONTENT MODERATION ({vibes.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1 border font-bold cursor-pointer ${
              activeTab === 'users'
                ? 'bg-[#487A8A] text-white border-[#487A8A]'
                : 'bg-white text-[#333] border-[#ccc]'
            }`}
          >
            03. USER GOVERNANCE ({users.length})
          </button>
        </div>

        {/* TAB 1: ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="yachiyo-panel p-4 space-y-4">
            <div className="font-bold text-[#224466] border-b border-dotted border-[#487A8A] pb-1">
              ■ Repository Performance &amp; Metrics
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-white border border-[#487A8A] p-3">
                <div className="text-[10px] text-[#666]">Total Artifacts</div>
                <div className="text-2xl font-bold text-[#0000CD] mt-1">{vibes.length}</div>
              </div>
              <div className="bg-white border border-[#487A8A] p-3">
                <div className="text-[10px] text-[#666]">Cumulative Stars</div>
                <div className="text-2xl font-bold text-[#e67e22] mt-1">{totalStars} ★</div>
              </div>
              <div className="bg-white border border-[#487A8A] p-3">
                <div className="text-[10px] text-[#666]">Registered Creators</div>
                <div className="text-2xl font-bold text-[#2e7d32] mt-1">{users.length}</div>
              </div>
              <div className="bg-white border border-[#487A8A] p-3">
                <div className="text-[10px] text-[#666]">Engine Status</div>
                <div className="text-sm font-bold text-[#111] mt-2">Next.js 15 &bull; RLS Active</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CONTENT MODERATION */}
        {activeTab === 'content' && (
          <div className="yachiyo-panel p-4 space-y-3">
            <div className="font-bold text-[#224466] border-b border-dotted border-[#487A8A] pb-1">
              ■ Artifact Review &amp; Moderation
            </div>

            <table className="yachiyo-table">
              <thead>
                <tr>
                  <th style={{ width: '90px' }}>Category</th>
                  <th>Title</th>
                  <th style={{ width: '110px' }}>Creator</th>
                  <th style={{ width: '80px' }}>Stars</th>
                  <th style={{ width: '160px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vibes.map((v) => (
                  <tr key={v.id}>
                    <td className="text-center font-bold text-[11px]">{v.category}</td>
                    <td>
                      <Link href={`/vibe/${v.id}`} className="text-[#0000CD] underline font-bold">
                        {v.title}
                      </Link>
                      {v.is_featured && (
                        <span className="ml-1 text-[#e11d48] font-bold text-[10px]">[Featured]</span>
                      )}
                    </td>
                    <td className="text-center">@{v.author?.username}</td>
                    <td className="text-center font-bold text-[#e67e22]">{v.star_count} ★</td>
                    <td className="text-center space-x-2">
                      <button
                        onClick={() => handleToggleFeature(v.id)}
                        className="text-[#0000CD] underline cursor-pointer"
                      >
                        {v.is_featured ? 'Unfeature' : '★ Feature'}
                      </button>
                      <button
                        onClick={() => handleDeleteVibe(v.id)}
                        className="text-red-600 underline font-bold cursor-pointer"
                      >
                        [Delete]
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: USER GOVERNANCE */}
        {activeTab === 'users' && (
          <div className="yachiyo-panel p-4 space-y-3">
            <div className="font-bold text-[#224466] border-b border-dotted border-[#487A8A] pb-1">
              ■ User Roles &amp; Account Status
            </div>

            <table className="yachiyo-table">
              <thead>
                <tr>
                  <th>User Profile</th>
                  <th style={{ width: '120px' }}>Current Role</th>
                  <th style={{ width: '100px' }}>Status</th>
                  <th style={{ width: '180px' }}>Permissions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <strong>@{u.username}</strong>
                      <div className="text-[10px] text-[#666]">{u.bio}</div>
                    </td>
                    <td className="text-center font-bold uppercase">{u.role}</td>
                    <td className="text-center font-bold">
                      {u.is_banned ? (
                        <span className="text-red-600">[Suspended]</span>
                      ) : (
                        <span className="text-emerald-700">[Active]</span>
                      )}
                    </td>
                    <td className="text-center space-x-2">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                        className="border border-[#808080] text-[11px] p-0.5 outline-none cursor-pointer"
                      >
                        <option value="user">user</option>
                        <option value="moderator">moderator</option>
                        <option value="admin">admin</option>
                      </select>

                      <button
                        onClick={() => handleBanToggle(u.id)}
                        className="text-red-600 underline cursor-pointer"
                      >
                        {u.is_banned ? 'Unban' : 'Ban User'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Footer />
      </main>
    </div>
  );
}
