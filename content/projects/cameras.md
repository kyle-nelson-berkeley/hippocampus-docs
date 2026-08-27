## What it is

Image streams into ROS: the MJPEG USB camera driver the vehicles use, and the event-camera
work from a research collaboration.

## The pieces

- **`mjpeg_cam`** — the ROS 2 driver: copies JPEG frames from USB cameras straight into
  `CompressedImage` messages, avoiding needless decode/encode overhead. `mjpeg_cam_ros1`
  is the ROS 1 original it descends from.
- **`event_camera_example`** — example code for the event camera
  (see [Event cameras](#/setup/lab-cameras/event-cameras) and the
  [collaboration notes](#/setup/lab-cameras/event-camera-collaboration) in Setup).

## Where it stands

Maintained. Camera selection, calibration, and configuration are Setup topics:
[Cameras group](#/setup/lab-cameras/usb-cameras) and
[Camera calibration](#/setup/guides/camera-calibration).
