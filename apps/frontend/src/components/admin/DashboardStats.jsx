import StatCard from "../StatCard";
const DashboardStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
      {stats.map((stat) => (
        <StatCard
          key={stat.label}
          title={stat.label}
          value={stat.value}
          iconSrc={stat.icon}
          iconClass={stat.iconClass}
        />
      ))}
    </div>
  );
};

export default DashboardStats;
