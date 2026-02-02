const AdminDashboardCard = ({ title, value, icon, bg = "bg-blue-100" }) => {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6 flex items-center gap-5
                    transition hover:shadow-md hover:-translate-y-0.5">
      
      {/* Icon */}
      <div
        className={`w-12 h-12 flex items-center justify-center rounded-xl
                    text-lg font-semibold ${bg}`}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="flex flex-col">
        <p className="text-sm font-medium text-gray-500">
          {title}
        </p>
        <p className="text-2xl font-semibold text-gray-800 leading-tight">
          {value}
        </p>
      </div>
    </div>
  );
};

export default AdminDashboardCard;
