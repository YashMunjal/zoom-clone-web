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
  if (video_image.className === "video_image vid_off" && audio_flags > 0) {
    video_image.className = "video_image vid_on";
    video_image.src = "img/vid_on.svg";
  } else if (
    video_image.className === "video_image vid_on" &&
    audio_flags > 0
  ) {
    video_image.className = "video_image vid_off";
    hideBtn.style.backgroundColor = "red";

    video_image.src = "img/vid_off.svg";
  }
  if (video_image.className === "video_image vid_off") {
    hideBtn.style.backgroundColor = "red";
  } else if (video_image.className === "video_image vid_on") {
    hideBtn.style.backgroundColor = "white";
  }
  video_flags++;

  myStream.getTracks()[1].enabled = !myStream.getTracks()[1].enabled;
}
function audioController() {
  if (audio_image.className === "audio_image mic_off" && audio_flags > 0) {
    audio_image.className = "audio_image mic_on";
    audio_image.src = "img/mic_on.svg";
  } else if (
    audio_image.className === "audio_image mic_on" &&
    audio_flags > 0
  ) {
    audio_image.className = "audio_image mic_off";
    muteBtn.style.backgroundColor = "red";
    audio_image.src = "img/mic_off.svg";
  }
  if (audio_image.className === "audio_image mic_off") {
    muteBtn.style.backgroundColor = "red";
  } else if (audio_image.className === "audio_image mic_on") {
    muteBtn.style.backgroundColor = "white";
  }
  audio_flags++;
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