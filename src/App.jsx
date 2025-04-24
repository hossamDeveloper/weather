import { useState } from 'react'
import { useSelector } from 'react-redux'
import TopNav from './components/TopNav'
import ForecastTabs from './components/ForecastTabs'
import WeeklyForecast from './components/WeeklyForecast'
import RainProbability from './components/RainProbability'
import TodayOverview from './components/TodayOverview'
import OtherCities from './components/OtherCities'

function App() {
  const { currentWeather } = useSelector((state) => state.weather)
  const [selectedTab, setSelectedTab] = useState('Today')

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1e3c72] via-[#2a5298] to-[#7db9e8]">
      <div className="container mx-auto px-4 py-6">
        <TopNav />
        
        <div className="mt-8">
          <ForecastTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {selectedTab === 'Today' && <TodayOverview />}
            {selectedTab === 'Tomorrow' && <TodayOverview isTomorrow={true} />}
            {selectedTab === 'Next 7 Days' && <WeeklyForecast />}
          </div>
          
          <div className="space-y-6">
            <RainProbability />
            <OtherCities />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
