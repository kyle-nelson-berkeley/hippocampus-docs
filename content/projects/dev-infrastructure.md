## What it is

How software actually reaches robots and users: deployment configuration for onboard
computers, the bot that builds Debian packages, and the dependency definitions that make
`rosdep` work for lab packages.

## The pieces

- **`hippo_deployment`** — systemd service files, monitoring-session setup, and device
  naming rules for the BlueROV / ROS 2 / PX4 runtime setup — how a vehicle boots into a
  working stack (see [Deployment](#/setup/concepts/deployment) in Concepts).
- **`buildbot`** — builds the pre-built Debian packages that
  [Pre-built packages](#/setup/getting-started/pre-built-packages) installs.
- **`hippo_infrastructure`** — rosdep yaml definitions per ROS distro.
- **`hippo-release`** — release automation; **`bag2to1`** — converts ROS 2 bags to ROS 1
  format for older analysis tools.

## Where it stands

Active — quietly load-bearing. If a package install or a vehicle boot behaves oddly,
this project is where the answer usually lives.
