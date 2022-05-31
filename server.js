const express = require('express');
const app = express();
app.use(express.static('public'));

const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

// ----------------------------------------------------------------------------
// Environment
// ----------------------------------------------------------------------------
const port = process.env.PORT || 8000;
const MONGODB_URL = "mongodb+srv://Fujimaki:Daisy0801@cluster0.aahxt.mongodb.net/?retryWrites=true&w=majority";

// ----------------------------------------------------------------------------
// Data
// ----------------------------------------------------------------------------

const mongoose = require('mongoose');
mongoose.connect(MONGODB_URL, { useNewUrlParser: true });

const userSchema = mongoose.Schema({
  name: String,
});

const LogSchema = mongoose.Schema({
  userName: String,
  action: String
}, { timestamps: true });

const Users = mongoose.model('User', userSchema);
const Log = mongoose.model('Log', LogSchema);

const onlineUsers = new Map(); // user id => user
const hiddenUsers = new Set();//ここに入ると名前が非表示になる

function buildEmitData(u) {
  return { id: u.id, name: u.name, hidden: hiddenUsers.has(u.id) };
}

function buildUserlist(){
  return Array.from(onlineUsers.values()).map(buildEmitData);
}

// ----------------------------------------------------------------------------
// Socket Event Handlers
// ----------------------------------------------------------------------------

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('nickname', (name) => {

    Users.findOneAndUpdate({ name }, {}, { upsert: true, new: true }, (err, u) => {
      console.log(name + ' loggedin.');
      onlineUsers.set(u.id, u);
      io.emit('UserList', buildUserlist());//ログインした人の名前表示

      socket.on('disconnect', () => {
        console.log(name + ' disconnected.');
        onlineUsers.delete(u.id);
        io.emit('UserList', buildUserlist());
      });

      socket.on('NoOpinions', (option) => {
        hiddenUsers.add(u.id);//リストに名前を加える

        if(option.timeout){
          setTimeout(() => {
            hiddenUsers.delete(u.id);//リストから名前を削除
            io.emit('ShowName', buildEmitData(u));
          }, 30000);
        }

        io.emit('NoOpinions', buildEmitData(u));//意見ありませんボタンを押した人にだけbuildEmitDataを実行

        Log.create({ userName: u.name, action: 'NoOpinions' });
      });

      socket.on('ShowName', () => {
        hiddenUsers.delete(u.id);
        io.emit('ShowName', buildEmitData(u));
        Log.create({ userName: u.name, action: 'ShowName' });
      });
    });

  });

  socket.on('teacher', () => {
    io.emit('UserList', buildUserlist());

    socket.on('disconnect', () => {
      console.log('teacher disconnected.');
    });

    socket.on('ShowAllNames', () => {
      hiddenUsers.clear();
      io.emit('UserList', buildUserlist());
      io.emit('Reset');
      Log.create({ userName: 'teacher', action: 'ShowAllNames' });
    });
  });

});


server.listen(port);
