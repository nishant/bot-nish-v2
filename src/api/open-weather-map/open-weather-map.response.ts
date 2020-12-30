export interface WeatherDataField {
  description: string;
  icon: string;
  main: string;
}

export interface CommonWeatherData {
  clouds: number;
  dt: number;
  humidity: number;
  weather: WeatherDataField[];
}

export interface CurrentWeatherData extends CommonWeatherData {
  // eslint-disable-next-line camelcase
  feels_like: number;
  sunrise: number;
  sunset: number;
  temp: number;
}

export interface HourlyWeatherData extends CommonWeatherData {
  // eslint-disable-next-line camelcase
  feels_like: number;
  temp: number;
}

export interface OpenWeatherMapResponse {
  current: CurrentWeatherData;
  hourly: HourlyWeatherData[];

  daily: [
    {
      // eslint-disable-next-line camelcase
      feels_like: {
        day: number;
        night: number;
      };
      sunrise: number;
      sunset: number;
      temp: {
        day: number;
        night: number;
        min: number;
        max: number;
      };
    },
  ];
}
