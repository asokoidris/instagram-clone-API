const app = require('./src/routes/index');
const db = require('./src/config/db');
const keys = require('./src/config/keys');
const Notification = require('./src/models/Notification');

const Port = keys.PORT || 3001;

db()
  .then(() => {
    console.log('Database connected');
  })
  .catch((err) => {
    console.log(`Database connection failed ${err}`);
  });

const server = app.listen(process.env.PORT || 3001, () => {
  console.log('Server started');
});

const io = require('socket.io')(server, { pingTimeout: 60000 });

io.on('connection', (socket) => {
  console.log('connected');
  socket.on('authenticated', (userId) => {
    console.log(userId, 'auth');
    socket.join(userId);
  });
  socket.on('join room', (groupId) => {
    socket.join(groupId);
  });
  socket.on('message', ({ groupId, message }) => {
    socket.broadcast.to(groupId).emit('message', { groupId, message });
  });
  socket.on('seen', (groupId) => {
    socket.broadcast.to(groupId).emit('seen', groupId);
  });
  socket.on('render', (groupId) => {
    socket.broadcast.to(groupId).emit('render', groupId);
  });
  socket.on('notification', async (msg) => {
    const notification = await Notification.create(msg);
    socket.broadcast.to(msg.to).emit('notification');
  });
  socket.on('disconnect', () => {
    console.log('disconnected');
  });
});
