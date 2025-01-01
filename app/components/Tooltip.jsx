function Tooltip({ description = "", value }) {
  return (
    <div className="relative group">
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 -translate-y-2 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
        <p>{description}</p>
        <p>{value}</p>
      </div>
    </div>
  );
}

export default Tooltip;