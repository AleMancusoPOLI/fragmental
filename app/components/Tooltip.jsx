function Tooltip({ description = "", value }) {
  return (
    <div className="relative group">
      <div className="w-fit text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-tooltip">
        <p className="truncate mb-0.5">{description}</p>
        <p className="text-center">{value}</p>
      </div>
    </div>
  );
}

export default Tooltip;
