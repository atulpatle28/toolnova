'use client';
import { useState } from 'react';

interface PollProps {
  author: string;
  question: string;
}

export default function PollCard({ author, question }: PollProps) {
  const [votes, setVotes] = useState({ yes: 0, no: 0 });
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = (type: 'yes' | 'no') => {
    if (!hasVoted) {
      setVotes(prev => ({ ...prev, [type]: prev[type] + 1 }));
      setHasVoted(true);
    }
  };

  const totalVotes = votes.yes + votes.no;
  const yesPercentage = totalVotes === 0 ? 0 : Math.round((votes.yes / totalVotes) * 100);
  const noPercentage = totalVotes === 0 ? 0 : Math.round((votes.no / totalVotes) * 100);

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl shadow-sm border border-indigo-100 p-5 mb-4">
      <div className="mb-4">
        <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded">Poll by {author}</span>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-4">{question}</h3>
      
      {!hasVoted ? (
        <div className="flex space-x-4">
          <button onClick={() => handleVote('yes')} className="flex-1 bg-white border-2 border-green-500 text-green-600 font-bold py-2 rounded-lg hover:bg-green-50 transition-colors">
            Yes
          </button>
          <button onClick={() => handleVote('no')} className="flex-1 bg-white border-2 border-red-500 text-red-600 font-bold py-2 rounded-lg hover:bg-red-50 transition-colors">
            No
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-semibold text-green-600">Yes</span>
              <span className="text-gray-600">{yesPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${yesPercentage}%` }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-semibold text-red-600">No</span>
              <span className="text-gray-600">{noPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${noPercentage}%` }}></div>
            </div>
          </div>
          <p className="text-center text-xs text-gray-500 mt-2">{totalVotes} total votes</p>
        </div>
      )}
    </div>
  );
}