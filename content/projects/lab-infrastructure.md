## What it is

The systems around the water that every experiment leans on: Qualisys motion capture for
millimeter ground truth, the gantry that moves equipment over the tank, and the physical
button boxes wired into the safety and convenience workflows.

## The pieces

- **`qualisys_bridge`** — reads 6-DOF rigid-body data from the Qualisys QTM system and
  republishes it as ROS 2 odometry, with an EKF for smoothing. The
  [Qualisys group](#/setup/lab-qualisys/calibration) in Setup covers calibration,
  camera settings, and defining bodies.
- **Gantry** — `gantry` (current control), `gantry_gui`, `gantry_msgs`, `rqt_gantry`,
  and the ROS 1-era `gantry_control`. The [Gantry group](#/setup/lab-gantry/general-information)
  in Setup covers installation and usage, including homing and the emergency button.
- **Buttons** — `buttons` + `buttons_msgs`: physical buttons and a small GUI for common
  actions at the tank.

## Where it stands

Active — this is shared infrastructure, so changes here affect everyone. Treat the Setup
pages as the operating manual and the repos as the implementation.
