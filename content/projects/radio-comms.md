## What it is

Getting data to and from vehicles without a tether: the HippoLink telemetry link over
Si1000-family radios, the MAVLink plumbing underneath, and software-defined radio
experiments.

## The pieces

- **`hippolink`** / **`hippolink_ros`** — the lab's lightweight telemetry protocol and its
  ROS wrapper.
- **`SiK`** — upstream radio firmware, forked with a HippoLink branch; `radio_firmware`
  and `radio_tools` support flashing and configuration.
- **`mavlink`**, **`mavlink_headers`**, **`mavros`** — MAVLink message plumbing and the
  ROS gateway, tracked as forks/pins.
- **`sdr`** / **`sdr_msgs`** — software-defined radio work
  (see [DVB-T](#/setup/guides/dvb-t) in Setup for the receiver side).

## Where it stands

Legacy: kept working, not actively developed. The hardware notes live in
[Hardware reference → RF modules](#/setup/hardware/rf-modules).
