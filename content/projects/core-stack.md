## What it is

The shared ROS 2 software every lab vehicle runs: control, state estimation, the message
definitions that tie nodes together, and the meta packages that pull a full system onto a
robot. If you contribute code to the lab, it probably lands here.

## The pieces

- **`hippo_control`** — attitude control (geometric and quaternion controllers), rate
  control, thruster models, actuator mixers (including a BlueROV variant), and trajectory
  tracking.
- **`state_estimation`** — the vehicle's estimate of where it is and how it moves.
- **`hippo_common` / `hippo_core`** — shared C++/Python utilities and the packages
  required in every setup.
- **Messages** — `hippo_msgs`, `hippo_control_msgs`, `hippo_common_msgs`,
  `state_estimation_msgs`: the interfaces between everything.
- **Meta packages** — `hippo_robot` (a robot without simulation) and `hippo_full`
  (everything) exist so one `apt install` or one workspace build gets a complete system.
- **PX4** — the flight-controller firmware and its ROS 2 message definitions are tracked
  as pinned upstream forks (`Firmware`, `px4_msgs`).

## Where it stands

Active and central. New features normally mean a change here plus a page in Setup.
The [Concepts](#/setup/concepts/ros2-workspace) group explains how the workspace,
colcon, and the pre-built packages fit together.
