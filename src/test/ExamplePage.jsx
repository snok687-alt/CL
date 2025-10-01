import React from 'react';
import ActorHotCard from './ActorHotCard';

const actorData = [
  {
    id: 1,
    name: 'มิโซโนะะ เนะ',
    image: '/images/actor1.jpg',
    videoTitle: 'รักครั้งแรกในหน้าร้อน',
    views: 98500
  },
  {
    id: 2,
    name: 'ฮาราโนะ ยูมิ',
    image: '/images/actor2.jpg',
    videoTitle: 'ห้องเรียนร้อนรัก',
    views: 125000
  },
  {
    id: 3,
    name: 'โซระ มิคาโกะ',
    image: '/images/actor3.jpg',
    videoTitle: 'คืนฝนพรำกับเธอ',
    views: 87200
  }
];

const ExamplePage = () => {
  const sortedActors = [...actorData].sort((a, b) => b.views - a.views);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">🔥 HOT RANKING</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {sortedActors.map((actor, index) => (
          <ActorHotCard key={actor.id} actor={actor} rank={index + 1} />
        ))}
      </div>
    </div>
  );
};

export default ExamplePage;
