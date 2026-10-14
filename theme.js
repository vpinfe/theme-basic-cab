// Basic Cab - the table's art, full screen, and nothing else.
//
// This file does three things, in this order: draw the list, draw the selection, and hand
// every message to core. The list is the wheel, which is not drawn:
// the art is the whole interface. Input, audio, preloading, the loading indicator, attract
// mode, turning the page for a sideways screen and the backglass and score view pages are
// core's.

const vpin = new VPinFECore();
window.vpin = vpin;                  // core and its overlays look for this name
window.receiveEvent = receiveEvent;  // core delivers every message through this one

start();

async function start() {
  vpin.init();
  await vpin.ready;                  // the tables, the options and the layout are in

  // Input. Core moves the wheel, pages it and opens the menu and the collection picker.
  // The one action it leaves to a theme is select, because launching is the theme's call.
  vpin.registerInputHandler((action) => {
    if (action === "select") vpin.launchTable(vpin.getCurrentTableIndex());
  });

  draw();
  document.body.dataset.ready = "true";
}

// --- 1. The list --------------------------------------------------------------------
// Basic Cab draws no list: the wheel moves under the art. activeList() is still what
// names the selected table - the wheel, unless core has opened the collection picker.

// --- 2. The selection ---------------------------------------------------------------
// Everything about the selected table is on its entry: entry.game is the game. The art
// is whatever getMedia answers for the playfield: the video or the picture, as the person's
// Playfield Media Priority says, falling back to the other when a table has only one.

const artEl = document.getElementById("art");
const nameEl = document.getElementById("name");

function drawSelection(list) {
  artEl.replaceChildren();
  nameEl.hidden = true;
  if (list.length === 0) return;

  // The collection picker's rows are not wheel entries: they have a label and no game or media.
  if (list.kind === "collection") {
    nameEl.textContent = list.current.label;
    nameEl.hidden = false;
    return;
  }

  const entry = list.current;
  const art = vpin.getMedia(list.cursor, "playfield");

  if (art.kind === "missing") {
    // No playfield art: say which table is selected.
    nameEl.textContent = entry.game.name;
    nameEl.hidden = false;
    return;
  }

  const isVideo = art.kind === "video";
  const media = document.createElement(isVideo ? "video" : "img");
  media.src = art.url;
  if (isVideo) Object.assign(media, { autoplay: true, loop: true, muted: true, playsInline: true });
  else media.alt = entry.game.name;

  // Core measures the art against the screen and turns it a quarter when its shape is the
  // wrong way round, so a landscape capture fills a portrait cabinet screen.
  media.className = "vpinfe-playfield-media";
  vpin.applyPlayfieldMediaRotation(media);
  artEl.appendChild(media);
}

// --- 3. Messages --------------------------------------------------------------------
// Core needs to see every message first: it keeps the selection, the audio and the
// loading indicator in step with them. After that the theme draws.
//
// TableIndexUpdate is the wheel moving. TableDataChange is a new list, and core has
// already filled in message.index by the time handleEvent returns.

async function receiveEvent(message) {
  await vpin.handleEvent(message);

  if (message.type === "TableIndexUpdate" || message.type === "TableDataChange") draw();
}

function draw() {
  drawSelection(vpin.activeList());
}
