/**
 * StatCard
 * 
 * Admin dashboard stat card
 * 
 * Props:
 * - title: string
 * - value: string | number
 * - iconSrc: string 
 * - iconAlt: string
 */

export default function StatCard({ title, value, iconSrc, iconAlt = "", iconClass = "w-10 h-10" }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-md px-8 py-8 flex flex-col items-center text-center">
      
      {/* Icon */}
      <div className="mb-3">
        <img 
          src={iconSrc}
          alt={iconAlt || title}
          className={`${iconClass} object-contain`}
        />
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-gray-900 leading-snug mb-3 whitespace-pre-line">
        {title}
      </h3>

      {/* Value */}
      <p className="text-4xl font-bold text-gray-900">{value}</p>
    </div>
  );
}