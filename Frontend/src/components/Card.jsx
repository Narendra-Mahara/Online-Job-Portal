const Card = ({ icon, title, desc }) => {
  return (
    <div className="bg-neutral-primary-soft  max-w-sm p-6 border border-gray-400 rounded-lg shadow-xs transition-all duration-300  hover:shadow-lg flex flex-col items-center gap-2 ">
      <div className="flex items-center justify-center text-center h-10 w-10 bg-gray-200 rounded-sm">{icon}</div>
      <h2 className="text-center mb-2 text-xl font-semibold text-heading">
        {title}
      </h2>
      <p className="mb-3 text-center">{desc}</p>
    </div>
  );
};

export default Card;
