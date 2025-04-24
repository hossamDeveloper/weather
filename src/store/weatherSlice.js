import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_KEY = '172646d116f38bee80ab80a5632cc13c';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// Fetch weather data using coordinates
export const fetchCurrentWeather = createAsyncThunk(
  'weather/fetchCurrentWeather',
  async (location, { rejectWithValue }) => {
    try {
      if (!location || !location.lat || !location.lon) {
        throw new Error('Invalid location data');
      }

      // First get current weather
      const currentResponse = await fetch(
        `${BASE_URL}/weather?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}&units=metric&lang=ar`
      );

      if (!currentResponse.ok) {
        const errorData = await currentResponse.json();
        return rejectWithValue(errorData.message || 'خطأ في جلب بيانات الطقس');
      }

      const currentData = await currentResponse.json();

      // Then get forecast
      const forecastResponse = await fetch(
        `${BASE_URL}/forecast?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}&units=metric&lang=ar`
      );

      if (!forecastResponse.ok) {
        const errorData = await forecastResponse.json();
        return rejectWithValue(errorData.message || 'خطأ في جلب بيانات التنبؤات');
      }

      const forecastData = await forecastResponse.json();

      return {
        current: currentData,
        forecast: forecastData
      };
    } catch (error) {
      console.error('API Error:', error);
      return rejectWithValue(error.message || 'خطأ في جلب بيانات الطقس');
    }
  }
);

// Search cities using geocoding API
export const searchCities = createAsyncThunk(
  'weather/searchCities',
  async (query, { rejectWithValue }) => {
    try {
      if (!query || query.length < 2) {
        return [];
      }

      const response = await fetch(
        `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'خطأ في البحث عن المدن');
      }

      const data = await response.json();
      
      if (!data || data.length === 0) {
        return [];
      }

      return data.map(city => ({
        name: city.name,
        country: city.country,
        state: city.state,
        lat: city.lat,
        lon: city.lon,
        fullName: `${city.name}, ${city.state ? `${city.state}, ` : ''}${city.country}`
      }));
    } catch (error) {
      console.error('Search Error:', error);
      return rejectWithValue(error.message || 'خطأ في البحث عن المدن');
    }
  }
);

const initialState = {
  currentWeather: null,
  forecast: {
    list: []
  },
  selectedLocation: null,
  searchedCities: [],
  loading: {
    weather: false,
    search: false
  },
  error: null
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setSelectedLocation: (state, action) => {
      state.selectedLocation = action.payload;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearWeatherData: (state) => {
      state.currentWeather = null;
      state.forecast = {
        list: []
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchCurrentWeather
      .addCase(fetchCurrentWeather.pending, (state) => {
        state.loading.weather = true;
        state.error = null;
      })
      .addCase(fetchCurrentWeather.fulfilled, (state, action) => {
        state.loading.weather = false;
        state.currentWeather = action.payload.current;
        state.forecast = action.payload.forecast;
        state.error = null;
      })
      .addCase(fetchCurrentWeather.rejected, (state, action) => {
        state.loading.weather = false;
        console.error('Weather fetch error:', action.payload);
        state.currentWeather = null;
        state.forecast = {
          list: []
        };
      })
      // Handle searchCities
      .addCase(searchCities.pending, (state) => {
        state.loading.search = true;
        state.error = null;
      })
      .addCase(searchCities.fulfilled, (state, action) => {
        state.loading.search = false;
        state.searchedCities = action.payload;
        state.error = null;
      })
      .addCase(searchCities.rejected, (state, action) => {
        state.loading.search = false;
        state.searchedCities = [];
        console.error('City search error:', action.payload);
      });
  }
});

export const { setSelectedLocation, clearError, clearWeatherData } = weatherSlice.actions;
export default weatherSlice.reducer; 