## What it is

The HippoCampus is the lab's own micro autonomous underwater vehicle: a small torpedo-shaped
robot sized for the institute's tank. This project collects everything that defines the
physical vehicle — the CAD model, the PCB designs, and the software that talks directly to
its hardware.

## The pieces

- **CAD** — the canonical model lives in
  [FinnBreu/hippocampus-cad](https://github.com/FinnBreu/hippocampus-cad) (Autodesk
  Inventor): hull tube, bulkheads, internal mounts for the Pixhawk-class flight controller,
  Raspberry Pi, camera, battery, and the marker mounts used for motion capture.
- **ESCs** — the motor controllers are AfroESC-family boards running the `tgy` firmware
  fork, driven over I2C. `esc` is the current driver; `esc_serial` and
  `teensy_esc_controller` are earlier and experimental paths.
- **Bring-up** — the `hardware` package launches the vehicle's onboard stack
  (see [HippoCampus bring-up](#/setup/hippocampus-bringup/motor-configuration) in Setup).
- **History** — `hardware_interfaces` and `camera` are the ROS 1-era equivalents, kept
  for reference.

## Where it stands

Actively used. The vehicle drives in the tank under motion capture, and the ESC and
bring-up path is exercised whenever a new unit is assembled. Start with the Setup pages;
read the repos when you need to change behavior, not to use it.
