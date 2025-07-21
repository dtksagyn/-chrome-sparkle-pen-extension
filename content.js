// content.js - TROUBLESHOOTING SPARKLES

let canvas = null;
let ctx = null;
let isPenActive = false;
let lastMouseX = -1;
let lastMouseY = -1;
let particles = [];
let animationFrameId = null;

// Global configuration for sparkle properties
// Ensure robust default.
let sparkleConfig = {
  shape: "circle", // Default shape: 'circle', 'star', 'bubble'
  // Add more config here later: color, size range, speed range, etc.
};

// --- Particle Class ---
class SparkleParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 3 + 1;
    this.life = Math.random() * 30 + 20;
    this.maxLife = this.life;
    this.opacity = 1;

    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 2 + 0.5;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;

    if (sparkleConfig.shape === "bubble") {
      this.bubbleRiseSpeed = Math.random() * 0.5 + 0.1;
      this.bubbleWobble = Math.random() * 0.1 - 0.05;
    }
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;

    this.vy += 0.05; // Gravity
    this.vx *= 0.98; // Dampen horizontal

    if (sparkleConfig.shape === "bubble") {
      this.y -= this.bubbleRiseSpeed;
      this.x += Math.sin(this.life * 0.1) * this.bubbleWobble;
    }

    this.opacity = this.life / this.maxLife;
  }

  draw(ctx) {
    // Ensure opacity doesn't go below 0 or above 1.
    const currentOpacity = Math.max(0, Math.min(1, this.opacity));
    if (currentOpacity <= 0) return; // Don't draw if invisible

    ctx.save();
    ctx.globalAlpha = currentOpacity; // Apply overall particle opacity

    // console.log(`Drawing particle at (${this.x}, ${this.y}) with shape: ${sparkleConfig.shape}`); // Debugging draw calls

    if (sparkleConfig.shape === "circle") {
      ctx.fillStyle = `white`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (sparkleConfig.shape === "star") {
      ctx.fillStyle = `yellow`;
      drawStar(ctx, this.x, this.y, 5, this.size * 2, this.size);
    } else if (sparkleConfig.shape === "bubble") {
      ctx.strokeStyle = `rgba(200, 200, 255, ${currentOpacity})`; // Use currentOpacity here too
      ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity * 0.2})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(
        this.x + this.size * 0.3,
        this.y - this.size * 0.3,
        this.size * 0.3,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity * 0.8})`;
      ctx.fill();
    }

    ctx.restore();
  }
}

// Helper function to draw a star (unchanged)
function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  let step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fill();
}

// --- Canvas Setup and Teardown ---
function setupCanvas() {
  if (canvas) {
    console.log("Canvas already exists, skipping setup.");
    return;
  }

  canvas = document.createElement("canvas");
  canvas.id = "sparklePenCanvas";
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.zIndex = "99999";
  canvas.style.pointerEvents = "none";

  document.body.appendChild(canvas);
  ctx = canvas.getContext("2d");

  function resizeCanvas() {
    if (canvas) {
      // Check if canvas still exists before accessing properties
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      console.log(`Canvas resized to ${canvas.width}x${canvas.height}`);
    }
  }
  // Remove previous listener to prevent duplicates if setupCanvas is called multiple times without teardown
  window.removeEventListener("resize", resizeCanvas); // Safety first
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  console.log("Sparkle canvas setup COMPLETE.");
}

function teardownCanvas() {
  if (canvas && canvas.parentNode) {
    document.body.removeChild(canvas);
    canvas = null;
    ctx = null;
    console.log("Sparkle canvas removed.");
  }
  stopAnimation();
}

// --- Animation Loop ---
function animate() {
  if (!ctx || !canvas) {
    // Ensure ctx and canvas exist
    console.warn(
      "animate: Canvas or context not available. Stopping animation."
    );
    stopAnimation();
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.update();
    if (p.life > 0) {
      p.draw(ctx);
    } else {
      particles.splice(i, 1);
    }
  }

  animationFrameId = requestAnimationFrame(animate);
}

function startAnimation() {
  if (!animationFrameId) {
    animationFrameId = requestAnimationFrame(animate);
    console.log("Animation started.");
  } else {
    console.log("Animation already running.");
  }
}

function stopAnimation() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
    console.log("Animation stopped.");
  } else {
    console.log("Animation not running.");
  }
  // Clear particles here so new activation starts fresh
  particles = [];
  if (ctx && canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas completely
  }
}

// --- Mouse Events for Drawing and Sparkles ---
function handleMouseMove(e) {
  if (!isPenActive) return;

  lastMouseX = e.clientX;
  lastMouseY = e.clientY;

  // console.log(`Mouse moved to: ${lastMouseX}, ${lastMouseY}. Pen Active: ${isPenActive}`); // Debug mouse move

  for (let i = 0; i < 3; i++) {
    particles.push(new SparkleParticle(lastMouseX, lastMouseY));
  }
  // console.log(`Particles count: ${particles.length}`); // Debug particle count
  startAnimation(); // Ensure animation is running as soon as particles are added
}

function addMouseListeners() {
  // Ensure no duplicate listeners
  document.removeEventListener("mousemove", handleMouseMove);
  document.addEventListener("mousemove", handleMouseMove);
  console.log("Mouse listeners added.");
}

function removeMouseListeners() {
  document.removeEventListener("mousemove", handleMouseMove);
  console.log("Mouse listeners removed.");
}

// --- Message Listener from Background Script / Popup ---
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Content script received message:", request.action);
  if (request.action === "activatePen") {
    if (!isPenActive) {
      isPenActive = true;
      setupCanvas();
      addMouseListeners();
      startAnimation();
      console.log(
        "Sparkle Pen activated. Canvas/Listeners/Animation initiated."
      );
    } else {
      console.log("Sparkle Pen already active.");
    }
    sendResponse({
      status: "success",
      isPenActive: isPenActive,
      currentSparkleConfig: sparkleConfig,
    });
  } else if (request.action === "deactivatePen") {
    if (isPenActive) {
      isPenActive = false;
      removeMouseListeners();
      stopAnimation();
      teardownCanvas();
      console.log(
        "Sparkle Pen deactivated. Canvas/Listeners/Animation torn down."
      );
    } else {
      console.log("Sparkle Pen already inactive.");
    }
    sendResponse({
      status: "success",
      isPenActive: isPenActive,
      currentSparkleConfig: sparkleConfig,
    });
  } else if (request.action === "getPenStatus") {
    console.log(
      "Responding to getPenStatus. isPenActive:",
      isPenActive,
      "Config:",
      sparkleConfig
    );
    sendResponse({
      isPenActive: isPenActive,
      currentSparkleConfig: sparkleConfig,
    });
  } else if (request.action === "updateSparkleConfig") {
    console.log("Updating sparkle config:", request.config);
    sparkleConfig = { ...sparkleConfig, ...request.config };
    sendResponse({ status: "success", newConfig: sparkleConfig });
  }
});

// INITIALIZATION: Check if pen was previously active (e.g., across refreshes)
// No, we want it to start inactive and wait for popup explicit activation.
// So, no auto-activation on content script injection.
