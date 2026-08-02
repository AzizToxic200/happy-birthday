const canvas = document.getElementById("sparkCanvas");
const ctx = canvas.getContext("2d");
const scene = document.querySelector(".birthday-card");
const photoDialog = document.getElementById("photoDialog");
const photoForm = document.getElementById("photoForm");
const photoOpen = document.getElementById("photoOpen");
const photoClose = document.getElementById("photoClose");
const clearPhoto = document.getElementById("clearPhoto");
const copyPhotoLink = document.getElementById("copyPhotoLink");
const shareHint = document.getElementById("shareHint");
const photoUrl = document.getElementById("photoUrl");
const birthdayPhoto = document.getElementById("birthdayPhoto");
const photoFrame = document.getElementById("photoFrame");
const birthdayAudio = document.getElementById("birthdayAudio");
const defaultPhotoUrl = "https://cdn.discordapp.com/attachments/1513293852306313246/1533314175290310847/Messenger_creation_05899181-23A9-45E7-BF23-DC6517AB4374_1.jpg?ex=6a70099a&is=6a6eb81a&hm=b00b5f9e38f4709957e7633f32a3a1d76d83ed0eafe3f40c6a42bf8a131710d4&";
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

function playBirthdaySongOnce() {
  if (musicStarted || !birthdayAudio) return;
  birthdayAudio.loop = false;
  birthdayAudio.volume = 0.72;
  birthdayAudio.currentTime = 0;

  const attempt = birthdayAudio.play();
  if (attempt && typeof attempt.then === "function") {
    attempt.then(() => {
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

function getPhotoFromUrl() {
  return new URLSearchParams(window.location.search).get("photo") || "";
}

function buildShareUrl(photo) {
  const url = new URL(window.location.href);
  if (photo) {
    url.searchParams.set("photo", photo);
  } else {
    url.searchParams.delete("photo");
  }
  return url.toString();
}

function setPagePhotoUrl(photo) {
  const shareUrl = buildShareUrl(photo);
  window.history.replaceState({}, "", shareUrl);
  return shareUrl;
}

async function copyShareUrl(photo) {
  const shareUrl = setPagePhotoUrl(photo);
  try {
    await navigator.clipboard.writeText(shareUrl);
    shareHint.textContent = "Link copied. Open it in any browser and the photo will appear.";
  } catch (error) {
    shareHint.textContent = shareUrl;
  }
}

function loadPhoto() {
  const sharedPhoto = getPhotoFromUrl();
  const savedPhoto = localStorage.getItem("birthdayPhotoUrl") || "";
  const activePhoto = sharedPhoto || savedPhoto || defaultPhotoUrl;
  photoUrl.value = activePhoto;
  applyPhoto(activePhoto);
  if (sharedPhoto) {
    localStorage.setItem("birthdayPhotoUrl", sharedPhoto);
  }
}

function openPhotoPanel() {
  if (typeof photoDialog.showModal === "function") {
    photoDialog.showModal();
    window.setTimeout(() => photoUrl.focus(), 80);
  }
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("pointerdown", () => {
  playBirthdaySongOnce();
  burst(90);
});
window.addEventListener("DOMContentLoaded", playBirthdaySongOnce, { once: true });
window.addEventListener("load", playBirthdaySongOnce, { once: true });
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) playBirthdaySongOnce();
});

photoOpen.addEventListener("click", openPhotoPanel);
photoClose.addEventListener("click", () => photoDialog.close());

photoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const cleanUrl = photoUrl.value.trim();
  localStorage.setItem("birthdayPhotoUrl", cleanUrl);
  applyPhoto(cleanUrl);
  copyShareUrl(cleanUrl);
  photoDialog.close();
  burst(70);
});

copyPhotoLink.addEventListener("click", () => {
  const cleanUrl = photoUrl.value.trim();
  if (!cleanUrl) {
    shareHint.textContent = "Add an image URL first.";
    return;
  }
  localStorage.setItem("birthdayPhotoUrl", cleanUrl);
  applyPhoto(cleanUrl);
  copyShareUrl(cleanUrl);
});

clearPhoto.addEventListener("click", () => {
  localStorage.removeItem("birthdayPhotoUrl");
  photoUrl.value = "";
  applyPhoto("");
  setPagePhotoUrl("");
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
window.setTimeout(playBirthdaySongOnce, 120);
window.setTimeout(playBirthdaySongOnce, 900);



