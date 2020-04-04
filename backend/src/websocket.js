const socketio = require("socket.io");
const parseStringAsArray = require("./utils/parseStringAsArray");
const calculateDistance = require("./utils/calculateDistance");

let io;
const connections = []; // variável para guardar as conexões
//  seria melhor guardar no BD

// exportando diretamente a função
exports.setupWebsocket = (server) => {
  io = socketio(server);

  // 'on' é um evento do tipo 'listener'
  // este método execulta apenas na conexão de um novo cliente na aplicação
  io.on("connection", (socket) => {
    const { latitude, longitude, techs } = socket.handshake.query;

    connections.push({
      id: socket.id,
      coordinates: {
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
      techs: parseStringAsArray(techs),
    });

    // '.emit('nomeQualquer', 'mensagemDesejada')'
    // setTimeout(() => {
    //     socket.emit('message', 'Hello Omnistack')
    // }, 3000);
  });
};

// < 10 'km'
exports.findConnections = (coordinates, techs) => {
  return connections.filter((connection) => {
    return (
      calculateDistance(coordinates, connection.coordinates) < 10 &&
      connection.techs.some((item) => techs.include(item))
    );
  });
};

exports.sendMessage = (to, message, data) => {
  to.forEach((connection) => {
    io.to(connection.id).emit(message, data);
  });
};
