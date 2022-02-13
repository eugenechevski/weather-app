import { DOMNodes } from './DOMNodes';
import dataRetriever from './dataRetriever';

export default function (): Renderer {
  let weatherAPI: DataRetriever;

  async function handleChangeMode(): Promise<any> {
    if (!document.body.classList.contains('dark')) {
      // Reveal the moon and stars
      DOMNodes.spriteMoon.classList.remove('hidden');
      DOMNodes.spriteStars.classList.remove('hidden');
      DOMNodes.spriteMoon.classList.add('flex');
      DOMNodes.spriteStars.classList.add('flex');
    } else {
      // Reveal the sun and clouds
      DOMNodes.spriteSun.classList.remove('hidden');
      DOMNodes.spriteClouds.classList.remove('hidden');
      DOMNodes.spriteSun.classList.add('flex');
      DOMNodes.spriteClouds.classList.add('flex');
    }

    await new Promise((res) => {
      setTimeout(() => {
        document.body.classList.toggle('dark');
        res('');
      });
    });

    await new Promise((res) => {
      setTimeout(() => {
        if (!document.body.classList.contains('dark')) {
          // Hide the moon and stars
          DOMNodes.spriteMoon.classList.remove('flex');
          DOMNodes.spriteMoon.classList.add('hidden');
          DOMNodes.spriteStars.classList.remove('flex');
          DOMNodes.spriteStars.classList.add('hidden');
        } else {
          // Hide the sun and clouds
          DOMNodes.spriteSun.classList.remove('flex');
          DOMNodes.spriteSun.classList.add('hidden');
          DOMNodes.spriteClouds.classList.remove('flex');
          DOMNodes.spriteClouds.classList.add('hidden');
        }
        res('');
      }, 500);
    });
  }

  async function displayViewContent(): Promise<any> {
    await new Promise((resolve) => {
      DOMNodes.homeContent.classList.add('opacity-0');

      setTimeout(() => {
        DOMNodes.homeContent.classList.remove('opacity-0');
        DOMNodes.homeContent.remove();

        document.body.children[0].appendChild(DOMNodes.viewContent);
        DOMNodes.viewContent.classList.add('opacity-0');
        DOMNodes.homeBtn.classList.remove('hidden');
        DOMNodes.homeBtn.classList.add('opacity-0');

        resolve('The first stage of the transition is complete.');
      }, 1000);
    });

    await new Promise((resolve) => {
      setTimeout(() => {
        DOMNodes.viewContent.classList.remove('opacity-0');
        DOMNodes.homeBtn.classList.remove('opacity-0');

        resolve('The second stage of the transition is complete.');
      }, 1000);
    });

    return new Promise((resolve) => {
      resolve('The transition is complete');
    });
  }

  async function displayHomeContent(): Promise<any> {
    await new Promise((resolve) => {
      DOMNodes.viewContent.classList.add('opacity-0');
      DOMNodes.homeBtn.classList.add('opacity-0');

      setTimeout(() => {
        DOMNodes.viewContent.remove();
        DOMNodes.homeBtn.classList.add('hidden');

        document.body.children[0].appendChild(DOMNodes.homeContent);
        resetAfterHomeLoadingStage();
        DOMNodes.homeContent.classList.add('opacity-0');

        resolve('The first stage of the transition has been completed.');
      }, 1000);
    });

    await new Promise((resolve) => {
      setTimeout(() => {
        DOMNodes.homeContent.classList.remove('opacity-0');
        resolve('The second stage of the transition has been completed.');
      }, 1000);
    });

    return new Promise((resolve) => {
      resolve('The transition has been completed.');
    });
  }

  async function setHomeLoadingStage(): Promise<any> {
    DOMNodes.homeStatusMessage.classList.add('opacity-0');
    DOMNodes.homeForm.classList.add('opacity-0');

    await new Promise((resolve) => {
      DOMNodes.homeSpinnerIcon.classList.add('opacity-0');
      setTimeout(() => {
        DOMNodes.homeSpinnerIcon.classList.add('inline');
        DOMNodes.homeSpinnerIcon.classList.remove('hidden');
        DOMNodes.homeStatusMessage.innerHTML = 'Almost there...';
        DOMNodes.homeStatusMessage.classList.remove('opacity-0');
        DOMNodes.homeSpinnerIcon.classList.remove('opacity-0');
        DOMNodes.homeForm.classList.add('hidden');
        DOMNodes.homeForm.classList.remove('opacity-0');

        resolve('The first stage of the transition is complete.');
      }, 2000);
    });

    await new Promise((resolve) => {
      setTimeout(() => {
        DOMNodes.homeStatusMessage.classList.add('opacity-0');
        resolve('The second stage of the transition is complete.');
      }, 2000);
    });

    await new Promise((resolve) => {
      setTimeout(() => {
        DOMNodes.homeStatusMessage.classList.remove('opacity-0');
        DOMNodes.homeStatusMessage.innerHTML = 'Just a moment...';
        resolve('The third stage of the transition is complete.');
      }, 2000);
    });

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('The transition is complete.');
      }, 2000);
    });
  }

  function resetAfterHomeLoadingStage(): void {
    DOMNodes.homeSpinnerIcon.classList.add('hidden');
    DOMNodes.homeSpinnerIcon.classList.remove('inline');
    DOMNodes.homeForm.classList.remove('hidden');
    DOMNodes.homeStatusMessage.innerHTML =
      "Let's see what the day has brought for us.";
  }

  function fillWithData(extractedData: { [key: string]: any }): void {
    document.querySelector(
      '.temperature-data'
    ).innerHTML = `${extractedData.temperature} C&#176;`;
    document.querySelector('.description-data').innerHTML =
      extractedData.description;
    document.querySelector('.city-name').innerHTML = extractedData.cityName;
    document.querySelector(
      '.city-time'
    ).innerHTML = `${extractedData.convertedTime.localHours}:${extractedData.convertedTime.localMinutes} ${extractedData.convertedTime.period}`;
    document.querySelector(
      '.pressure-data'
    ).innerHTML = `${extractedData.pressure}mb`;
    document.querySelector(
      '.humidity-data'
    ).innerHTML = `${extractedData.humidity}%`;
    document.querySelector(
      '.visibility-data'
    ).innerHTML = `${extractedData.visibility}km`;
    document.querySelector(
      '.wind-speed-data'
    ).innerHTML = `${extractedData.windSpeed}m/s`;
  }

  async function renderWeather(data: { [field: string]: any }): Promise<any> {
    if (!DOMNodes.viewContent.isConnected) {
      await displayViewContent();
    }

    fillWithData(data);

    return new Promise((resolve) => {
      resolve('Rendering is complete.');
    });
  }

  async function handleHomeSearch(searchTerm: string): Promise<any> {
    await setHomeLoadingStage();
    const APIresponse: Promise<Response> = await weatherAPI.requestWeather(
      searchTerm
    );

    if (!(await APIresponse).ok) {
      resetAfterHomeLoadingStage();
      DOMNodes.homeErrorMessage.textContent =
        'Could not find the city, check for spelling errors.';
    } else {
      const extractedData = weatherAPI.extractData(
        await (await APIresponse).json()
      );
      await renderWeather(extractedData);
    }
  }

  function initGlobals(): void {
    weatherAPI = dataRetriever();
  }

  function initNodes(): void {
    DOMNodes.spriteSun = document.querySelector('.sun');
    DOMNodes.spriteClouds = document.querySelector('.clouds');
    DOMNodes.spriteMoon = document.querySelector('.moon');
    DOMNodes.spriteStars = document.querySelector('.stars');
    DOMNodes.homeSearch = document.querySelector('.home-search');
    DOMNodes.homeForm = document.querySelector('.home-form');
    DOMNodes.homeErrorMessage = document.querySelector('.home-error');
    DOMNodes.homeSpinnerIcon = document.querySelector('.spinner');
    DOMNodes.homeStatusMessage = document.querySelector('.status-message');
    DOMNodes.homeContent = document.querySelector('.home-content');
    DOMNodes.homeBtn = document.querySelector('.icon-home');
    DOMNodes.modeSwitch = document.querySelector('.mode-switch');
    DOMNodes.viewContent = document.querySelector('.view-content');
  }

  function initListeners(): void {
    DOMNodes.modeSwitch.addEventListener('click', handleChangeMode);
    DOMNodes.homeBtn.addEventListener('click', displayHomeContent);
    DOMNodes.homeForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const searchArg = DOMNodes.homeSearch.value;
      if (searchArg.length < 5) {
        DOMNodes.homeErrorMessage.textContent =
          'The city name has to be at least 5 characters long.';
        return;
      }

      handleHomeSearch(DOMNodes.homeSearch.value);
    });
    DOMNodes.homeSearch.addEventListener('input', () => {
      DOMNodes.homeErrorMessage.textContent = '';
    });
  }

  function configurePage(): void {
    DOMNodes.viewContent.remove();
  }

  function init(): void {
    initGlobals();
    initNodes();
    initListeners();
    configurePage();
  }

  return {
    init,
  };
}
