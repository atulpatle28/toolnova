'use client';
import { useState } from 'react';

interface PostProps {
  author: string;
  content: string;
  timeAgo: string;
}

export default function PostCard({ author, content, timeAgo }: PostProps) {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
          <div>
            <h3 className="font-semibold text-gray-900">{author}</h3>
            <p className="text-xs text-gray-500">{timeAgo}</p>
          </div>
        </div>
      </div>
      <p className="text-gray-800 text-base mb-4">{content}</p>
      
      <div className="flex items-center space-x-4 border-t border-gray-50 pt-3">
        <button onClick={() => setLikes(likes + 1)} className="flex items-center space-x-1 text-gray-500 hover:text-green-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path></svg>
          <span className="font-medium">{likes}</span>
        </button>
        <button onClick={() => setDislikes(dislikes + 1)} className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"></path></svg>
          <span className="font-medium">{dislikes}</span>
        </button>
      </div>
    </div>
  );
}