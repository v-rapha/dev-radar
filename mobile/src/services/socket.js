import socketio from 'socket.io-client';

const socket = socketio('http://192.168.15.5:3333', {
    autoConnect: false,
});

function subscribeToNewDevs(subscribeFunction) {
    socket.on('new-dev', subscribeFunction);
}

function connect(latitude, longitude, techs) {
    // enviado como parâmetros para o backend
    socket.io.opts.query = {
        latitude,
        longitude,
        techs,
    };

    socket.connect();

    // em algum momento recebeu-se uma mensagem
    // socket.on('message', text => {
    //     console.log(text);
    // });
}

function disconnect() {
    if (socket.connected) {
        socket.disconnect();
    }
}

export {
    connect,
    disconnect,
    subscribeToNewDevs,
};