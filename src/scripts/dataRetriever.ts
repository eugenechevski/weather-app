const APIkey = 'a819f921f5250f2b850f752955513993';

export default function (): DataRetriever {
  function convertTime(timeZoneShift: number): {
    [timeData: string]: string | number;
  } {
    /**
     * Because the Weather API stores timezone offset in seconds, but the Date object
     * in minutes with the opposite sign, I have to divide the API's offset by 60 and
     * take the opposite of the Date object's in order to find the difference between
     * the host machine's time and the requested city's time.
     */
    const localTime = new Date(Date.now());
    const timezoneDiff: number =
      timeZoneShift / 60 - localTime.getTimezoneOffset() * -1;
    localTime.setHours(localTime.getHours() + timezoneDiff / 60);
    localTime.setMinutes(localTime.getMinutes() + (timezoneDiff % 60));

    const militaryHours: number = localTime.getHours();

    let localHours: string | number;
    let localMinutes: string | number;
    let period: 'AM' | 'PM';

    if (militaryHours === 0 || militaryHours === 12) {
      localHours = 12;
    } else {
      localHours = militaryHours % 12;
    }
    localMinutes = localTime.getMinutes();
    period = militaryHours < 12 ? 'AM' : 'PM';

    return {
      localHours,
      localMinutes,
      period,
    };
  }

  function extractData(dataContainer: { [field: string]: any }): {
    [key: string]: any;
  } {
    const temperature: string = (dataContainer.main.temp - 273.15).toFixed(2);
    let { description } = dataContainer.weather[0];
    description = description.charAt(0).toUpperCase() + description.slice(1);
    const convertedTime = convertTime(dataContainer.timezone);
    const cityName: string = dataContainer.name;
    const { pressure } = dataContainer.main;
    const { humidity } = dataContainer.main;
    const visibility: number = dataContainer.visibility / 1000;
    const windSpeed: number = dataContainer.wind.speed;

    return {
      temperature,
      description,
      cityName,
      convertedTime,
      pressure,
      humidity,
      visibility,
      windSpeed,
    };
  }

  function requestWeather(cityName: string): Promise<Response> {
    return fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName.toLowerCase()}&appid=${APIkey}`
    );
  }

  return {
    extractData,
    requestWeather,
  };
}
