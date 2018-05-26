var socket = new WebSocket("ws://localhost:8081");
var doc = document;
var txtSend = doc.getElementById('txtSend');
var btnSend = doc.getElementById('btnSend');
var txtLogin = doc.getElementById('txtLogin');
var btnLogin = doc.getElementById('btnLogin');



socket.onmessage = function (event) {
  var incomingMessage = event.data;
  var envelop = JSON.parse(incomingMessage);
  dispatcher(envelop);
};

var Envelop = function (modul, command, msg) {
  this.modul = modul;
  this.command = command;
  this.msg = msg;
}

function dispatcher(envelop) {
  switch (envelop.modul) {
    case 'profile':
      var profile = new Profile(envelop);
      profile.showUsers();
      break;
    case 'ra':

      break;
    case 'chat':
      var chat = new Chat(envelop.msg);
      chat.showMsg();
      break;
  }
}

var Chat = function (inMsg) {
  this.inMsg = inMsg;
}

Chat.prototype.showMsg = function () {
  var messageElem = document.createElement('div');
  messageElem.appendChild(document.createTextNode(this.inMsg));
  document.getElementById('subscribe').appendChild(messageElem);
}

btnSend.onclick = function () {
  var env = new Envelop('chat', 'msg', txtLogin.value + ': ' + txtSend.value)
  socket.send(JSON.stringify(env));
}

btnLogin.onclick = function () {
  var env = new Envelop('ra', 'msg', txtLogin.value)
  socket.send(JSON.stringify(env));
}

var Profile = function (arr) {
  this.arr = arr;
}

Profile.prototype.showUsers = function () {
  var usersElem = document.createElement('div');
  usersElem.appendChild(document.createTextNode(this.arr.msg));
  document.getElementById('userList').appendChild(usersElem);
}