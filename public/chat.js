$(document).ready(function() {
  var socket = io.connect("http://localhost:7000");

  var username = $("#username");

  var change_username = $("#change_username");

  var feedback = $("#feedback");
  var status = $("#status");

  var message = $("#message");

  var change_message = $("#change_message");

  change_message.click(() => {
    socket.emit("new_message", { message: message.val() });
  });

  socket.on("new_message", data => {
    //feedback.html("");
    status.html("");
    message.val("");

    feedback.append("<p>" + data.username + ":" + data.message + "</p>");
  });

  change_username.click(() => {
    socket.emit("change_username", {
      username: username.val()
    });
  });

  message.bind("keypress", () => {
    socket.emit("typing");
  });

  socket.on("typing", data => {
    status.html(
      "<p><i>" + data.username + " is typing a message ..." + "</i></p>"
    );
  });
});
