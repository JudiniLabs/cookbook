const { getIO } = require("../socket");

    const createQr = async (qr, name) => {
        const io = await getIO();
        io.emit('qr', qr);
    };

const quitarQr = async (bool, number) => {
    const io = await getIO();
  // Emitir el valor booleano 'bool' al usuario específico para que deje de renderizar el código QR
  io.emit("qr", bool);
  console.log("number", number)
  io.emit("data", {number: number})
  //io.to(name).emit("bool", bool)
};

module.exports  = {
    createQr,
    quitarQr
}