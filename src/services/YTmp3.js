const dotenv = require("dotenv").config();

class YTmp3 {
  url = "";
  id  = "";

  constructor(url) {
    this.setUrl(url);
  }

  setUrl(url) {
    if (!this.isYoutubeUrl(url)) {
      console.log("No se encutra la url");
      return;
    }
    this.url = url;
    if(!this.getVideoID()){
        console.log("no se encontro el video");
        return;
    }
  }

  isYoutubeUrl(url) {
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+$/;

    // Verificar la URL contra la expresión regular
    return youtubeRegex.test(url);
  }

  getVideoID(){
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/;
    
    // Ejecutar la expresión regular en la URL
    const match = this.url.match(youtubeRegex);
    
    // Si se encuentra una coincidencia, devuelve el ID del video
    if (match) {
        this.id = match[1]; // El ID del video es el primer grupo capturado
        return match[1];
    }
    
    // Si no se encuentra una coincidencia, devuelve null
    return null;
}
  async fetchData() {
    const url = `https://youtube-mp36.p.rapidapi.com/dl?id=${this.id}`;
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.YT_MP3_KEY,
        "x-rapidapi-host": "youtube-mp36.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = YTmp3;