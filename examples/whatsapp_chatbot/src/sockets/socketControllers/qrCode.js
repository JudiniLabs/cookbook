const { getIO } = require("../socket");

    const createQr = async (qr, name) => {
        const io = await getIO();
        io.emit('qr', qr);
    };

const quitarQr = async (bool, name) => {
    const io = await getIO();
  // Emitir el valor booleano 'bool' al usuario específico para que deje de renderizar el código QR
  io.emit("qr", bool);
  //io.to(name).emit("bool", bool)
};

module.exports  = {
    createQr,
    quitarQr
}