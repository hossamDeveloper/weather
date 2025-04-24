import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCurrentWeather } from '../store/weatherSlice'
import { 
  FaWind, 
  FaTint, 
  FaCloudRain, 
  FaTemperatureHigh, 
  FaTemperatureLow,
  FaEye,
  FaSun,
  FaMoon,
  FaCompass,
  FaCloud
} from 'react-icons/fa'

const TodayOverview = ({ isTomorrow = false }) => {
  const dispatch = useDispatch()
  const { currentWeather, forecast, selectedLocation, loading } = useSelector((state) => state.weather)

  useEffect(() => {
    if (selectedLocation) {
      dispatch(fetchCurrentWeather(selectedLocation))
    }
  }, [dispatch, selectedLocation])

  if (loading.weather) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!currentWeather || !forecast) {
    return null
  }

  const getWeatherData = () => {
    if (isTomorrow) {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const tomorrowData = forecast.list.find(item => {
        const itemDate = new Date(item.dt * 1000)
        return itemDate.getDate() === tomorrow.getDate()
      })
      return tomorrowData || currentWeather
    }
    return currentWeather
  }

  const weatherData = getWeatherData()
  const date = new Date(weatherData.dt * 1000)
  const formattedDate = date.toLocaleDateString('ar-SA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })

  const getWeatherIcon = (condition) => {
    const icons = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Snow': '🌨️',
      'Thunderstorm': '⛈️',
      'Drizzle': '🌦️',
      'Mist': '🌫️',
      'Smoke': '🌫️',
      'Haze': '🌫️',
      'Dust': '🌫️',
      'Fog': '🌫️',
      'Sand': '🌫️',
      'Ash': '🌫️',
      'Squall': '🌪️',
      'Tornado': '🌪️'
    }
    return icons[condition] || '❓'
  }

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/30 hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {isTomorrow ? 'توقعات الطقس غداً' : 'توقعات الطقس اليوم'}
          </h2>
          <p className="text-gray-600">{formattedDate}</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-gray-800">
            {Math.round(weatherData.main.temp)}°C
          </div>
          <div className="text-gray-600 capitalize">
            {weatherData.weather[0].description}
          </div>
          <div className="text-4xl mt-2">
            {getWeatherIcon(weatherData.weather[0].main)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30">
          <div className="flex items-center gap-2 mb-2">
            <FaTemperatureHigh className="text-red-500" />
            <span className="text-gray-600">درجة الحرارة العظمى</span>
          </div>
          <div className="text-xl font-semibold text-gray-800">
            {Math.round(weatherData.main.temp_max)}°C
          </div>
        </div>

        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30">
          <div className="flex items-center gap-2 mb-2">
            <FaTemperatureLow className="text-blue-500" />
            <span className="text-gray-600">درجة الحرارة الصغرى</span>
          </div>
          <div className="text-xl font-semibold text-gray-800">
            {Math.round(weatherData.main.temp_min)}°C
          </div>
        </div>

        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30">
          <div className="flex items-center gap-2 mb-2">
            <FaWind className="text-blue-600" />
            <span className="text-gray-600">سرعة الرياح</span>
          </div>
          <div className="text-xl font-semibold text-gray-800">
            {weatherData.wind.speed} م/ث
          </div>
        </div>

        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30">
          <div className="flex items-center gap-2 mb-2">
            <FaCompass className="text-blue-600" />
            <span className="text-gray-600">اتجاه الرياح</span>
          </div>
          <div className="text-xl font-semibold text-gray-800">
            {weatherData.wind.deg}°
          </div>
        </div>

        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30">
          <div className="flex items-center gap-2 mb-2">
            <FaTint className="text-blue-600" />
            <span className="text-gray-600">الرطوبة</span>
          </div>
          <div className="text-xl font-semibold text-gray-800">
            {weatherData.main.humidity}%
          </div>
        </div>

        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30">
          <div className="flex items-center gap-2 mb-2">
            <FaCloudRain className="text-blue-600" />
            <span className="text-gray-600">احتمال هطول الأمطار</span>
          </div>
          <div className="text-xl font-semibold text-gray-800">
            {weatherData.pop ? `${Math.round(weatherData.pop * 100)}%` : '0%'}
          </div>
        </div>

        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30">
          <div className="flex items-center gap-2 mb-2">
            <FaEye className="text-blue-600" />
            <span className="text-gray-600">الرؤية</span>
          </div>
          <div className="text-xl font-semibold text-gray-800">
            {weatherData.visibility / 1000} كم
          </div>
        </div>

        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30">
          <div className="flex items-center gap-2 mb-2">
            <FaCloud className="text-blue-600" />
            <span className="text-gray-600">الغيوم</span>
          </div>
          <div className="text-xl font-semibold text-gray-800">
            {weatherData.clouds.all}%
          </div>
        </div>

        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30">
          <div className="flex items-center gap-2 mb-2">
            <FaSun className="text-yellow-500" />
            <span className="text-gray-600">الشروق</span>
          </div>
          <div className="text-xl font-semibold text-gray-800">
            {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30">
          <div className="flex items-center gap-2 mb-2">
            <FaMoon className="text-gray-600" />
            <span className="text-gray-600">الغروب</span>
          </div>
          <div className="text-xl font-semibold text-gray-800">
            {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TodayOverview 