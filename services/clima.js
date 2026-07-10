const axios = require('axios');

async function obtenerClima(ciudad) {
  const apiKey = process.env.WEATHERAPI_KEY;
  const url = 'https://api.openweathermap.org/data/2.5/weather';

  if (!apiKey) {
    throw new Error('La API key del clima no está configurada');
  }

  try {
    const respuesta = await axios.get(url, {
      params: {
        q: ciudad,
        appid: apiKey,
        units: 'metric',
        lang: 'es'
      },
      timeout: 5000
    });

    return {
      ciudad: respuesta.data.name,
      temperatura: respuesta.data.main.temp,
      descripcion: respuesta.data.weather[0].description
    };
  } catch (error) {
    if (error.response) {
      throw new Error(
        `El servicio de clima respondió con error ${error.response.status}`
      );
    }

    if (error.code === 'ECONNABORTED') {
      throw new Error(
        'El servicio de clima tardó demasiado en responder'
      );
    }

    throw new Error(
      'No se pudo conectar con el servicio de clima'
    );
  }
}

module.exports = {
  obtenerClima
};