const ActorHotCard = ({ actor, rank }) => {
  const rankColors = ['bg-red-600', 'bg-orange-500', 'bg-yellow-400'];
  const rankLabels = ['HOT', 'HOT', 'HOT'];

  return (
    <div className="relative w-full aspect-[2/3] overflow-hidden rounded-xl shadow-lg group">
      {/* ป้าย HOT แบบเอียง */}
      {rank <= 3 && (
        <div className="absolute top-2 left-[-24px] z-20 transform -rotate-45">
          <div
            className={`w-22 text-center py-1 text-xs font-bold text-white ${rankColors[rank - 1]} shadow-md drop-shadow-md`}
          >
            👑 {rankLabels[rank - 1]} {rank}
          </div>
        </div>
      )}

      {/* รูปนักแสดง */}
      <img
        src={actor.image}
        alt={actor.name}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {/* ซ่อนข้อมูลไว้ (ถ้าต้องการแสดงตอน hover) */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-2 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="font-semibold truncate">{actor.name}</h3>
        <p className="text-xs truncate">{actor.videoTitle}</p>
        <p className="text-xs text-blue-300">{actor.views.toLocaleString()} views</p>
      </div>
    </div>
  );
};

export default ActorHotCard;
