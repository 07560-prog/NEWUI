'use client';

import React, { useState } from 'react';
import { Comment, Profile } from '@/types';
import { addLocalComment } from '@/lib/storage';

interface CommentsSectionProps {
  vibeId: string;
  initialComments: Comment[];
  currentUser: Profile | null;
}

export default function CommentsSection({
  vibeId,
  initialComments,
  currentUser,
}: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [inputContent, setInputContent] = useState('');
  const [authorName, setAuthorName] = useState(currentUser?.username || 'Anonymous');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim()) return;

    setIsSubmitting(true);
    const userToUse: Profile = currentUser || {
      id: 'guest_user',
      username: authorName.trim() || 'Anonymous',
      role: 'user',
      created_at: new Date().toISOString(),
    };

    const newComment = addLocalComment(vibeId, inputContent.trim(), userToUse);
    setComments([newComment, ...comments]);
    setInputContent('');
    setIsSubmitting(false);
  };

  const handleDelete = (commentId: string) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      setComments(comments.filter((c) => c.id !== commentId));
    }
  };

  return (
    <div className="space-y-4 text-xs">
      {/* BBS Header */}
      <div className="bg-[#E6F4F7] border-2 border-[#487A8A] px-3 py-1.5 flex items-center justify-between font-bold text-[#224466]">
        <span>💬 BBS / Discussion Board ({comments.length} comments)</span>
        <span className="text-[10px] text-[#666] font-normal">※ Please keep feedback constructive</span>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="bg-white border-2 border-[#487A8A] p-3 space-y-2.5">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-[#333]">Your Name:</span>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="border border-[#808080] px-2 py-0.5 text-xs outline-none w-48"
            placeholder="Anonymous"
          />
          <span className="text-[10px] text-[#777]">
            (Logged in as: @{currentUser?.username || 'Guest'})
          </span>
        </div>

        <div>
          <textarea
            value={inputContent}
            onChange={(e) => setInputContent(e.target.value)}
            placeholder="Share your feedback, aesthetic review, or technical thoughts ☆"
            rows={3}
            className="w-full border border-[#808080] p-2 text-xs outline-none focus:border-[#487A8A] leading-relaxed"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !inputContent.trim()}
            className="bg-[#FF7733] text-white font-bold px-4 py-1 border border-[#D26432] shadow-sm hover:bg-[#ff8844] disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? 'Posting...' : 'Post Message (POST)'}
          </button>
        </div>
      </form>

      {/* Comment List in BBS Thread Format */}
      <div className="space-y-3">
        {comments.length === 0 ? (
          <div className="p-4 text-center text-[#777] border border-dashed border-[#ccc] bg-white">
            No comments yet. Be the first to share your critique! ☆
          </div>
        ) : (
          comments.map((comment, index) => {
            const threadNum = String(comments.length - index).padStart(3, '0');
            const isAuthorOrAdmin =
              currentUser &&
              (currentUser.id === comment.user_id || currentUser.role === 'admin');

            return (
              <div
                key={comment.id}
                className="bg-white border border-[#487A8A] p-3 space-y-1.5 shadow-xs"
              >
                <div className="flex items-center justify-between border-b border-dotted border-[#ccc] pb-1">
                  <div className="text-[11px]">
                    <span className="font-bold text-[#0000CD]">[{threadNum}]</span>{' '}
                    Posted by: <strong className="text-[#111]">@{comment.author?.username || 'Anonymous'}</strong>{' '}
                    <span className="text-[#888]">
                      ({new Date(comment.created_at).toLocaleString()})
                    </span>
                    {comment.author?.role === 'admin' && (
                      <span className="ml-1 bg-red-100 text-red-700 border border-red-300 px-1 text-[9px] font-bold">
                        Admin
                      </span>
                    )}
                  </div>

                  {isAuthorOrAdmin && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-red-600 underline text-[10px] hover:text-red-800 cursor-pointer"
                    >
                      [Delete]
                    </button>
                  )}
                </div>

                <p className="text-xs text-[#222] whitespace-pre-wrap leading-relaxed pt-1 pl-2 border-l-2 border-[#E0F7FA]">
                  {comment.content}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
