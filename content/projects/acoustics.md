## What it is

Acoustic sensing around the vehicles: the doppler velocity log (DVL) that measures
velocity over ground, and the message definitions for acoustic ranging and modems.

## The pieces

- **`dvl`** — the DVL driver, integrated on the BlueROV
  (see [DVL](#/setup/bluerov/dvl) in Setup).
- **`dvl_msgs`**, **`acoustic_msgs`** — the interfaces; `acoustic_msgs-release` is its
  release-automation counterpart.

## Where it stands

Maintained: driven by hardware in the lab rather than active algorithm work. The acoustic
ranging *simulation* lives with the Simulation project; the modem hardware notes live in
[Hardware reference → Acoustic modems](#/setup/hardware/acoustic-modems).
