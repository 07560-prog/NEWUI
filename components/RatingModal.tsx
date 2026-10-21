'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { rateVibeLocal } from '@/lib/storage';
import confetti from 'canvas-confetti';

interface RatingModalProps {
  vibeId: string;
  vibeTitle: string;
  currentAvg: number;
  ratingCount: number;
  userRating?: number;
  isOpen: boolean;
  onClose: () => void;
  onRated: (newAvg: number, newCount: number, rating: number) => void;
}

export default function RatingModal({
  vibeId,
  vibeTitle,
  currentAvg,
  ratingCount,
  userRating: initialUserRating,
  isOpen,
  onClose,
  onRated,
}: RatingModalProps) {
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedRating, setSelectedRating] = useState<number>(initialUserRating || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmitRating = (rating: number) => {
    setSelectedRating(rating);
    setIsSubmitting(true);

    try {
      const { avgRating, count } = rateVibeLocal(vibeId, rating);
      
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#FF7733', '#87D4DA', '#FFD700'],
      });

      setTimeout(() => {
        setIsSubmitting(false);
        onRated(avgRating, count, rating);
        onClose();
      }, 400);
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-sm bg-white border-2 border-[#487A8A] shadow-xl text-xs text-[#222]">
        
        {/* Title Bar */}
        <div className="bg-[#224466] text-white px-3 py-1 flex items-center justify-between font-bold">
          <span>★ RATE ARTIFACT (EVALUATION)</span>
          <button
            onClick={onClose}
            className="hover:bg-red-600 px-1 font-bold text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="border-b border-dotted border-[#ccc] pb-2">
            <span className="font-bold text-[#D26432]">Selected Artifact:</span>
            <div className="text-sm font-bold text-[#0000CD] mt-0.5 truncate">
              {vibeTitle}
            </div>
          </div>

          <div className="flex items-center justify-between bg-[#F0F8FF] border border-[#487A8A] p-2 text-xs">
            <div>
              <span className="text-[#666]">Average Rating:</span>
              <div className="text-lg font-bold text-[#e67e22]">
                ★ {currentAvg.toFixed(1)} <span className="text-xs text-[#666] font-normal">/ 5.0</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[#666]">Total Votes:</span>
              <div className="text-sm font-bold text-[#333] mt-0.5">
                {ratingCount} votes
              </div>
            </div>
          </div>

          {/* Star selector */}
          <div className="flex flex-col items-center justify-center py-2 space-y-2">
            <div className="flex items-center space-x-1.5">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = (hoverRating || selectedRating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => handleSubmitRating(star)}
                    disabled={isSubmitting}
                    className="p-1 cursor-pointer transition-transform hover:scale-125"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        active
                          ? 'fill-[#FF9900] text-[#FF9900]'
                          : 'text-[#ccc] hover:text-[#999]'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <span className="text-xs text-[#555]">
              {hoverRating ? `${hoverRating} Stars` : selectedRating ? `Your Rating: ${selectedRating} Stars` : 'Click a star to submit your rating'}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
