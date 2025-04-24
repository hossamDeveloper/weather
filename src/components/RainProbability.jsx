import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCurrentWeather } from '../store/weatherSlice'
import { FaCloudRain } from 'react-icons/fa'

const RainProbability = () => {
  const dispatch = useDispatch()
  const { forecast, selectedLocation, loading } = useSelector((state) => state.weather)

  useEffect(() => {
    if (selectedLocation) {
      dispatch(fetchCurrentWeather(selectedLocation))
    }
  }, [dispatch, selectedLocation])

  if (loading.weather) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!forecast || !forecast.list || forecast.list.length === 0) {
    return null
  }

  const getRainProbability = (pop) => {
    if (!pop) return 'لا أمطار'
    if (pop <= 0.3) return 'احتمال ضعيف'
    if (pop <= 0.6) return 'احتمال متوسط'
    return 'احتمال مرتفع'
  }

  const getRainIcon = (pop) => {
    if (!pop) return '☀️'
    if (pop <= 0.3) return '🌤️'
    if (pop <= 0.6) return '🌦️'
    return '🌧️'
  }

  // Get forecast for the next 12 hours
  const hourlyForecast = forecast.list.slice(0, 4).map(item => ({
    time: new Date(item.dt * 1000),
    pop: item.pop || 0,
    rain: item.rain ? item.rain['3h'] : 0,
    icon: getRainIcon(item.pop),
    probability: getRainProbability(item.pop)
  }))

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/30 hover:shadow-xl transition-all duration-300">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">احتمالية هطول الأمطار</h2>
      <div className="space-y-5">
        {hourlyForecast.map((hour, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{hour.icon}</span>
              <span className="text-gray-600 font-medium">
                {hour.time.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-32 bg-gray-100 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-blue-400 to-blue-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${hour.pop * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-600">
                {hour.probability}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RainProbability 