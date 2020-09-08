const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const myPeer = new Peer(undefined, {
  host: "peerjs-server.herokuapp.com" || "/",
  secure: true,
  port: 443,
});
const myVideo = document.createElement("video");
window.onload = function () {
  myVideo.muted = true;
};
//myVideo.muted = true
const peers = {};
var myStream;
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myStream = stream;
    videoController();
    audioController();
    addVideoStream(myVideo, stream);

    myPeer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });
  });

socket.on("user-disconnected", (userId) => {
  if (peers[userId]) peers[userId].close();
});

myPeer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
  call.on("close", () => {
    video.remove();
  });

  peers[userId] = call;
}

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  // console.log(video);

  video.className = "column";

  videoGrid.append(video);
}

//UI script

var muteBtn = document.querySelector(".mute");
var hideBtn = document.querySelector(".video-hide");
var audio_image = document.querySelector(".audio_image");
var video_image = document.querySelector(".video_image");

//flags
var audio_flags = 0;
var video_flags = 0;

hideBtn.addEventListener("click", () => {
  videoController();
});
muteBtn.addEventListener("click", () => {
  audioController();
});

function videoController() {
  myStream.getTracks()[1].enabled = !myStream.getTracks()[1].enabled;
}
function audioController() {
  myStream.getTracks()[0].enabled = !myStream.getTracks()[0].enabled;
}


//modal

/*var modal = document.getElementById("myModal");
var btn = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];


window.onload = function() {
  modal.style.display = "block";
}
span.onclick = function() {
  modal.style.display = "none";
}
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}*/