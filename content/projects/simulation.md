## What it is

Run the robots in software before the tank: Gazebo worlds, the plugins that make water
behave like water (buoyancy, drag, thrusters), and the vehicle models.

## The pieces

- **`hippo_sim`** — the entry point: launch files, vehicle spawning, worlds.
- **`hippo_gz_plugins`** — the custom Gazebo plugins (buoyancy, hydrodynamics, thrusters,
  and sensors).
- **`hippo_simulation`** — simulation resources from the previous generation.
- **`sitl_gazebo`** — upstream fork for PX4 software-in-the-loop.
- **`acoustic_simulator`** and the `UWRange_acoustic_simulator` fork — simulate acoustic
  ranging between vehicles, from the lab's published work on two-way-ranging localization.

## Where it stands

Maintained. The simulation is the standard first stop for control and localization work —
[Starting the Gazebo simulation](#/setup/getting-started/starting-gazebo-simulation) in
Setup gets you a swimming vehicle in a few commands.
