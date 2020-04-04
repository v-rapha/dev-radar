const axios = require("axios");
const Dev = require("../models/Dev");
const parseStringAsArray = require("../utils/parseStringAsArray");
const { findConnections, sendMessage } = require("../websocket");

module.exports = {
  async index(req, res) {
    const devs = await Dev.find();
    return res.json(devs);
  },

  async store(req, res) {
    // recebendo os dados passados ao 'body'(vindo do insomnia)
    const { github_username, techs, latitude, longitude } = req.body;

    // verificação para evitar o cadastramento duplicado
    // passando como parâmetro o 'github_username'
    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      // consumindo a API do github passando o 'username'
      const response = await axios.get(
        `http://api.github.com/users/${github_username}`
      );

      // retirando apenas as informações necessárias da requisição
      const { name = login, avatar_url, bio } = response.data;

      // transformando as tecnologias passadas em um 'array' atribuindo virgulas e retirando espaços
      // para ser cadastrado no BD
      const techsArray = parseStringAsArray(techs);

      // tranformando os dados de 'longitude e latitude' para ser reconhecido pelo BD
      const location = {
        type: "Point",
        coordinates: [longitude, latitude],
      };

      // criando o 'usuário' usando os dados requisitados
      // foi atribuido a uma variável para poder ser mostrado os dados cadastrados
      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location,
      });

      // filtrar as conexões que estão há no máximo 10km de distância
      // e que o novo dev tenha pelo menos uma das tecnologias filtradas

      const sendSocketMessageTo = findConnections(
        { latitude, longitude },
        techsArray
      );

      // console.log(sendSocketMessageTo);
      sendMessage(sendSocketMessageTo, "new-dev", dev);
    }

    return res.json(dev);
  },
};
