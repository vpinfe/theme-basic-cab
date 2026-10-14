# Basic Cab

The simplest theme for a cabinet. The playfield screen shows the selected table's art, full
screen, with nothing drawn over it. The wheel moves, the art changes, and a press of the
select button starts the table. Everything else is core's.

![Basic Cab](preview.png)

Requires VPinFE 3.0 or later (`min_vpinfe` in `manifest.json`).

## What it looks like

- The playfield screen is black with the table's playfield picture stretched edge to edge.
  When a cabinet mounts that screen sideways, core turns the picture so it fills the screen.
- A table with no playfield art shows its name in the middle of the screen.
- The backglass and score view screens are core's own pages: the table's backglass or score
  view art, full screen.
- While a table starts, core dims the screens and draws its loading indicator.

## What is here

```
manifest.json         name, version, author, min_vpinfe and the windows the theme draws
options.json          the options a person can change, with their defaults
index_playfield.html  the playfield page
style.css             the look
theme.js              the behavior
preview.png           shown in the theme list
```

## The two JSON files

JSON cannot carry comments, so what each field does is here.

`manifest.json`

| Field | What it does |
| --- | --- |
| `name`, `version`, `author`, `description` | Shown in the theme list. `version` is the theme's own release number |
| `preview_image` | The screenshot shown in the theme list |
| `type` | `cab`: made for a cabinet's screens |
| `min_vpinfe` | The oldest VPinFE that can run the theme. `3.0` is what gets the core parts below |
| `windows` | The pages the theme draws. Basic Cab draws `playfield` only, so core's backglass and score view pages are used |
| `change_log` | Shown as "What's new" to someone installing the theme or updating it |

`options.json` declares what a person can change under the theme's settings. The theme
reads the value from `vpin.themeConfig` under the entry's `key`.

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `playfieldVideo` | boolean | off | Plays the table's playfield video when it has one. Off, or a table with no video, shows the picture |

## The four parts of theme.js

1. **Options** - read what `options.json` declared.
2. **The list** - none. The wheel moves under the art, so nothing is drawn.
3. **The selection** - draw the selected table's playfield picture or video, and its name
   when it has neither.
4. **Messages** - hand every message to core, then redraw when the selection moves or the
   list changes.

The art is drawn by the theme instead of an element marked `data-vpin-media`, because core's
choice for that element is the video whenever the table has one and this theme shows the
picture unless the person asks for the video. The theme gives the element the
`vpinfe-playfield-media` class and calls `vpin.applyPlayfieldMediaRotation`, which is how the
art turns to fit a sideways screen.

## What core does, so this theme does not

| Core handles | The theme's part |
| --- | --- |
| Keys, buttons and the remote: stepping, paging, the menu and the collection picker | Launch on `select` |
| Moving the selection and wrapping around the list | Nothing |
| Audio for the selected table | Nothing |
| Preloading the neighbors | Nothing |
| Turning the page and the art for a sideways cabinet screen | Put `vpinfe-upright` on the outermost element, and `vpinfe-playfield-media` on the art |
| The loading indicator while a table starts, from the cabinet or from a remote | Restyle `.vpinfe-launch-spinner` |
| Dimming the screens while a table launches | Nothing |
| Attract mode | Nothing |
| The backglass and score view pages | Nothing: Basic Cab ships none, so core's are used |

## Opt-outs

Basic Cab uses none of these. A theme that draws one of these things itself turns core's off
in a `config.json` next to `manifest.json`, and says why in its own README.

| Core's part | Key in `config.json` | Default for a 3.0 theme |
| --- | --- | --- |
| Moving and paging the selection | `navigation.enabled` | on |
| Audio | `audio.enabled` | on |
| Turning the page and the art | `layout.enabled` | on |
| Preloading the neighbors | `preload.enabled` | on |
| The loading indicator | `launch_indicator.enabled` | on |
| Attract mode | `attract.enabled` | on |
| Dimming windows while a table launches | `launch_dim.enabled` | on |
| Media in an element marked `data-vpin-media` | `media_window.enabled` | on |
| The waiting-for-tables notice | `waiting.enabled` | on |
| The hold ring | `hold_ring.enabled` | on |

For example, a theme with its own launch screen:

```json
{ "launch_indicator": { "enabled": false } }
```

`vpin.enabled("core_launch_indicator")` tells the theme at run time whether core's is on.
A backglass or score view page is an opt-out by shipping one: add `index_backglass.html` or
`index_scoreview.html` and list the window in `manifest.json`.
