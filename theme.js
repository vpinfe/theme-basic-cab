// Basic Cab - the table's art, full screen, and nothing else.
//
// This file does four things, in this order: read the options, draw the list, draw the
// selection, and hand every message to core. The list is the wheel, which is not drawn:
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

// --- 1. Options ---------------------------------------------------------------------
// options.json declares them and carries their defaults; core merges in what the person
// chose. Read them where they are used so the value always matches what the person set.

function option(key, fallback) {
  const value = vpin.themeConfig ? vpin.themeConfig[key] : undefined;
  return value === undefined ? fallback : value;
}

// --- 2. The list --------------------------------------------------------------------
// Basic Cab draws no list: the wheel moves under the art. activeList() is still what
// names the selected table - the wheel, unless core has opened the collection picker.

// --- 3. The selection ---------------------------------------------------------------
// Everything about the selected table is on its entry: entry.game is the game and
// entry.media lists the kinds of art that have a file. The art is drawn here instead of
// by a data-vpin-media element because core's choice is the video whenever there is one,
// and this theme shows the picture unless the person asks for the video.

const artEl = document.getElementById("art");
const nameEl = document.getElementById("name");

function drawSelection(list) {
  artEl.replaceChildren();
  nameEl.hidden = true;
  if (list.length === 0) return;

  const entry = list.current;
  const wantVideo = option("playfieldVideo", false) && entry.media.includes("playfield_video");

  if (!wantVideo && !entry.media.includes("playfield")) {
    // No playfield art: say which table is selected.
    nameEl.textContent = entry.game.name;
    nameEl.hidden = false;
    return;
  }

  const media = document.createElement(wantVideo ? "video" : "img");
  // getMediaURL answers with the video whenever there is one; getImageURL is the picture.
  media.src = wantVideo ? vpin.getMediaURL(list.cursor, "playfield") : vpin.getImageURL(list.cursor, "playfield");
  if (wantVideo) Object.assign(media, { autoplay: true, loop: true, muted: true, playsInline: true });
  else media.alt = entry.game.name;

  // Core measures the art against the screen and turns it a quarter when its shape is the
  // wrong way round, so a landscape capture fills a portrait cabinet screen.
  media.className = "vpinfe-playfield-media";
  vpin.applyPlayfieldMediaRotation(media);
  artEl.appendChild(media);
}

// --- 4. Messages --------------------------------------------------------------------
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
