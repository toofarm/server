var http = require('http');
var socket = require('socket.io');

var config = require('../../config/server.js');


module.exports = function(app){
  var server = http.createServer(app);
  var io = socket(server);

  io.on('connection', function(socket){
    var room;

    socket.on('room', function(pRoom){
      if (room) {
        socket.leave(room);
      }
      socket.join(pRoom);
      room = pRoom;
      console.log('Joining room', pRoom);
    });

    socket.on('drawClick', function(data) {
      if (!room) return;
      io.to(room).emit('draw', {
        x: data.x,
        y: data.y,
        type: data.type
      });
    });

    socket.on('saveImage', function() {
      if (!room) return;
      io.to(room).emit('save');
    });

    socket.on('undoClick', function() {
      if (!room) return;
      io.to(room).emit('undo');
    });

    socket.on('clearClick', function() {
      if (!room) return;
      io.to(room).emit('clear');
    });

    socket.on('changeColor', function(data) {
      if (!room) return;
      io.to(room).emit('color', data);
    });

    socket.on('changeWidth', function(data) {
      if (!room) return;
      io.to(room).emit('width', data);
    });

    socket.on('dragStart', function(data) {
      if (!room) return;
      console.log('Emitting to room', room);
      io.to(room).emit('dstart', {
        x: data.x,
        y: data.y,
        color:data.color
      });
    });

    socket.on('dragAction', function(data) {
      if (!room) return;
      io.to(room).emit('drag', {
        x: data.x,
        y: data.y,
        color:data.color
      });
    });

    socket.on('dragEnd', function(data) {
      if (!room) return;
      io.to(room).emit('dend', {
        x: data.x,
        y: data.y,
        color:data.color
      });
    });

    socket.on('insertText', function(data) {
      if (!room) return;
      io.to(room).emit('text', {
        text: data.text,
        x: data.x,
        y: data.y
      });
    });

    socket.on('resetScreen', function() {
      if (!room) return;
      io.to(room).emit('reset');
    });
  });



  var port = config.socketsPort;
  server.listen(port);

  console.log('Sockets.io listening on port ' + port);
};
