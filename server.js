var WebSocketServer = new require('ws');

var clients = [];

var webSocketServer = new WebSocketServer.Server({
  port: 8081
});

webSocketServer.on('connection', function (ws) {
  var id = Math.random();
  var user = new User(id, ws, '');
  clients.push(user);

  ws.on('message', function (message) {
    console.log('получено сообщение ' + message);
    var envelop = JSON.parse(message);
    dispatcher(envelop);
  });

  ws.on('close', function () {
    console.log('соединение закрыто ' + id);
    delete clients.id;
  });

});

var Envelop = function (modul, command, msg) {
  this.modul = modul;
  this.command = command;
  this.msg = msg;
}

var User = function (id, ws, userName) {
  this.id = id;
  this.ws = ws;
  this.userName = userName;
}

function dispatcher(envelop) {
  switch (envelop.modul) {
    case 'profile':

      break;
    case 'ra':
      var ra = new RA(envelop);
      ra.handleruser();
      profile();
      break;
    case 'chat':
      var chat = new Chat(envelop);
      chat.sendMSG();
      break;
  }
}

var Chat = function (envelop) {
  this.envelop = envelop;
}

Chat.prototype.sendMSG = function () {
  for (let i = 0; i < clients.length; i++) {
    clients[i].ws.send(JSON.stringify(this.envelop));
  }
}

var RA = function (envelop) {
  this.envelop = envelop;
}

RA.prototype.handleruser = function () {
  for (var i = 0; i < clients.length; i++) {
    if (clients[i].userName === '') {
      clients[i].userName = this.envelop.msg;
      break;
    }
  }
}

function profile() {
  var str = "";
  for (var i = 0; i < clients.length; i++) {
    str += clients[i].userName + ",";
  }
  var evp = new Envelop('profile', 'msg', str)
  for (let i = 0; i < clients.length; i++) { 
    clients[i].ws.send(JSON.stringify(evp));
  }
}