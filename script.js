const canvas = document.getElementById("sparkCanvas");
const ctx = canvas.getContext("2d");
const scene = document.querySelector(".birthday-card");
const photoDialog = document.getElementById("photoDialog");
const photoForm = document.getElementById("photoForm");
const photoOpen = document.getElementById("photoOpen");
const photoClose = document.getElementById("photoClose");
const clearPhoto = document.getElementById("clearPhoto");
const photoUrl = document.getElementById("photoUrl");
const birthdayPhoto = document.getElementById("birthdayPhoto");
const photoFrame = document.getElementById("photoFrame");
const birthdayAudio = document.getElementById("birthdayAudio");
let particles = [];
let musicStarted = false;

function resizeCanvas() {
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
}

function burst(amount = 150) {
  const rect = scene.getBoundingClientRect();
  const colors = ["#ff2d86", "#ff9ccc", "#ffd557", "#ffffff", "#ff77b7"];
  for (let i = 0; i < amount; i += 1) {
    particles.push({
      x: rect.left + rect.width / 2 + (Math.random() - .5) * rect.width * .7,
      y: rect.top + rect.height * .62 + (Math.random() - .5) * 120,
      vx: (Math.random() - .5) * 5,
      vy: Math.random() * 3 + 1,
      size: Math.random() * 5 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: Math.random() * 100 + 90
    });
  }
}

function draw() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  particles = particles.filter((particle) => particle.life > 0);
  particles.forEach((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy += .025;
    particle.life -= 1;
    ctx.globalAlpha = Math.max(particle.life / 130, 0);
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
  requestAnimationFrame(draw);
}

function playAudioOnce() {
  if (musicStarted) return;
  birthdayAudio.loop = false;
  birthdayAudio.volume = 0.62;
  birthdayAudio.currentTime = 0;
  const playPromise = birthdayAudio.play();
  if (playPromise && typeof playPromise.then === "function") {
    playPromise.then(() => {
      musicStarted = true;
    }).catch(() => {
      musicStarted = false;
    });
  } else {
    musicStarted = true;
  }
}

function applyPhoto(url) {
  const cleanUrl = url.trim();
  if (!cleanUrl) {
    birthdayPhoto.removeAttribute("src");
    photoFrame.classList.remove("show");
    return;
  }
  birthdayPhoto.src = cleanUrl;
  photoFrame.classList.add("show");
}

function loadPhoto() {
  const savedPhoto = localStorage.getItem("birthdayPhotoUrl") || "";
  photoUrl.value = savedPhoto;
  applyPhoto(savedPhoto);
}

function openPhotoPanel() {
  if (typeof photoDialog.showModal === "function") {
    photoDialog.showModal();
    window.setTimeout(() => photoUrl.focus(), 80);
  }
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("pointerdown", () => {
  playAudioOnce();
  burst(90);
});
window.addEventListener("keydown", playAudioOnce, { once: true });
window.addEventListener("DOMContentLoaded", playAudioOnce, { once: true });
window.addEventListener("load", playAudioOnce, { once: true });

photoOpen.addEventListener("click", openPhotoPanel);
photoClose.addEventListener("click", () => photoDialog.close());

photoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const cleanUrl = photoUrl.value.trim();
  localStorage.setItem("birthdayPhotoUrl", cleanUrl);
  applyPhoto(cleanUrl);
  photoDialog.close();
  burst(70);
});

clearPhoto.addEventListener("click", () => {
  localStorage.removeItem("birthdayPhotoUrl");
  photoUrl.value = "";
  applyPhoto("");
  photoDialog.close();
});

birthdayPhoto.addEventListener("error", () => {
  photoFrame.classList.remove("show");
});

resizeCanvas();
draw();
loadPhoto();
window.setTimeout(() => burst(36), 850);
window.setTimeout(() => burst(48), 1850);
window.setTimeout(() => burst(70), 3350);
window.setTimeout(() => burst(150), 4550);
window.setInterval(() => burst(24), 6500);
window.setTimeout(playAudioOnce, 120);
window.setTimeout(playAudioOnce, 700);
