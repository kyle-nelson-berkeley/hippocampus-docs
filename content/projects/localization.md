## What it is

Knowing where the vehicle is inside the tank. The current approach is visual: cameras on
the vehicle detect AprilTag markers, and an EKF fuses the detections into a pose estimate.
Earlier acoustic and radio-frequency approaches are kept alongside.

## The pieces

- **`visual_localization`** — the current camera + AprilTag localization stack.
- **AprilTag plumbing** — the `apriltag_ros` / `apriltag_msgs` forks, `apriltag_viz` for
  overlay visualization, and `apriltags` (printable tag36h11 sheets).
- **EKF lineage** — the `mu_auv_localization` and `ext_auv_localization` forks carry the
  published microAUV localization work this builds on.
- **Alternatives** — `acoustic_localization` (ranging-based) and the `RF_Localization` /
  `rf_localization_ros` forks (433 MHz radio) explored other modalities.
- **`vision`** — ROS 1-era vision package, kept for reference.

## Where it stands

Active. [AprilTag localization](#/setup/getting-started/apriltag-localization) in Setup
walks through running it; the Qualisys motion-capture system provides ground truth when
evaluating changes.
