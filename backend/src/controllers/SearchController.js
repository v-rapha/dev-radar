const Dev = require("../models/Dev");
const parseStringAsArray = require("../utils/parseStringAsArray");

// buscar todos devs num raio 10km
// filtrar por tecnologias
// '$in:'(operador) está na documentação do mongoDB
module.exports = {
  async index(req, res) {
    const { latitude, longitude, techs } = req.query;

    const techsArray = parseStringAsArray(techs);

    const devs = await Dev.find({
      techs: {
        $in: techsArray,
      },
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: 10000, // aumentar o número para descobrir novos devs
        },
      },
    });

    return res.json({ devs }); // pode retirar as chaves!!
  },
};
