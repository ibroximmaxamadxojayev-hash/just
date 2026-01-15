export {};

(() => {
  const FRAME_URL = "https://just.up.railway.app/frame.html";


  const box = document.createElement("div");
  box.id = "helper-box";
  box.style = `
    position:fixed;
    top:60px;
    right:20px;
    width:420px;
    height:520px;
    background:#fff;
    border:2px solid #007bff;
    border-radius:8px;
    z-index:999999;
    display:flex;
    flex-direction:column;
    overflow:hidden;
    font-family:system-ui;
  `;

  box.innerHTML = `
    <div id="hb-head" style="background:#007bff;color:#fff;padding:6px;display:flex;justify-content:space-between;cursor:move">
      <span>HelperBox</span>
      <span id="hb-close" style="cursor:pointer">✖</span>
    </div>
    <iframe id="hb-frame" style="flex:1;border:0"></iframe>
  `;

  document.body.appendChild(box);

  const frame = box.querySelector("#hb-frame");
  frame.src = FRAME_URL;

  box.querySelector("#hb-close").onclick = () => box.remove();

  // Ctrl+B toggle
  let visible = true;
  document.addEventListener("keydown", e => {
    if (e.ctrlKey && e.key.toLowerCase() === "b") {
      visible = !visible;
      box.style.display = visible ? "" : "none";
    }
  });

  // Drag
  let sx, sy, lx, ly, drag = false;
  const head = box.querySelector("#hb-head");

  head.onpointerdown = e => {
    drag = true;
    sx = e.clientX;
    sy = e.clientY;
    const r = box.getBoundingClientRect();
    lx = r.left;
    ly = r.top;
    head.setPointerCapture(e.pointerId);
  };

  window.onpointermove = e => {
    if (!drag) return;
    box.style.left = lx + e.clientX - sx + "px";
    box.style.top  = ly + e.clientY - sy + "px";
    box.style.right = "auto";
  };
  window.onpointerup = () => drag = false;

  // ===== SNAPSHOT =====
  function sendSnapshot() {
    const clone = document.documentElement.cloneNode(true);

    const helper = clone.querySelector("#helper-box");
    if (helper) helper.remove();

    clone.querySelectorAll("iframe").forEach(f => f.remove());

    const html = "<!doctype html>" + clone.outerHTML;
    frame.contentWindow.postMessage({ type:"HOST_HTML", html }, "*");
  }

  setInterval(sendSnapshot, 1000);

  // ===== SCROLL =====
  window.addEventListener("scroll", () => {
    frame.contentWindow.postMessage({
      type:"SCROLL",
      x: window.scrollX,
      y: window.scrollY
    }, "*");
  }, true);

  // ===== CURSOR =====
  document.addEventListener("mousemove", e => {
    frame.contentWindow.postMessage({
      type:"CURSOR",
      x: e.clientX,
      y: e.clientY
    }, "*");
  });

  // ===== CLICK =====
  document.addEventListener("click", e => {
    frame.contentWindow.postMessage({
      type:"CLICK",
      x: e.clientX,
      y: e.clientY
    }, "*");
  }, true);

  // ===== CHAT RELAY =====
  window.addEventListener("message", e => {
    if (e.source !== frame.contentWindow) return;
    if (e.data.type === "CHAT") {
      frame.contentWindow.postMessage(e.data, "*");
    }
  });

})();

