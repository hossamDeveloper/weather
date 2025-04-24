import { FaSun, FaCalendarAlt, FaCalendarWeek } from 'react-icons/fa'

const ForecastTabs = ({ selectedTab, setSelectedTab }) => {
  const tabs = [
    { id: 'Today', icon: <FaSun className="h-5 w-5" />, label: 'اليوم' },
    { id: 'Tomorrow', icon: <FaCalendarAlt className="h-5 w-5" />, label: 'غداً' },
    { id: 'Next 7 Days', icon: <FaCalendarWeek className="h-5 w-5" />, label: 'الأسبوع القادم' },
  ]

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg p-4 border border-white/30">
      <div className="flex justify-between items-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
              selectedTab === tab.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
            }`}
          >
            {tab.icon}
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default ForecastTabs 