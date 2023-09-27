const { Server } = require("socket.io");
const auth = require("./middlewares/auth");
const massageHandler = require("./controllers/messages");
const io = new Server(8080, { cors: { origin: "*" } });
const clients = {};

io.use(auth);
// connection,disconnect is default , socket is who make the connection
io.on("connection", (socket) => {
  const user_id = socket.handshake.headers.user_id;
  clients[user_id] = { socket_id: socket.id, user_id };
  console.log(clients);

  massageHandler(socket, io);
  socket.on("disconnect", () => {
    // console.log(socket.id);
    for (const key in clients) {
      if (clients[key].socket_id === socket.id) {
        delete clients[key];
      }
    }
    console.log(clients);
  });
});