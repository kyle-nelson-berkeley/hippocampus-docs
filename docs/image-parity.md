# Image parity: old Sphinx site → this site (Cloudinary)

*Full origin cross-check run 2026-09-03 against the live old site
(https://hippocampusrobotics.github.io/docs/). Method: every one of the 71 migrated old
pages was fetched (HTTP 200 asserted per page — a themed 404 body never counts), every
`<img>` src was resolved against its page URL, Sphinx chrome (`_static/`, `data:` URIs)
was excluded, and each remaining content image was matched against the migrated page's
references via `data/cloudinary-manifest.json`.*

## Totals

- Old pages checked: **71 of 71** migrated pages (all fetched with HTTP 200).
- Content images found on old pages: **40 references, 36 distinct files** — on 13 pages;
  the other 58 migrated pages carry no content images.
- Present on the corresponding migrated page: **40 of 40** — **no gaps; nothing to fix.**
- Corpus floor: all 36 distinct old-site images are in `assets/setup/` (upload sources)
  and uploaded to Cloudinary (`hippocampus-docs/setup/`, see the manifest).
- The 26 dropped ROS 1 pages are out of parity scope by construction — they have no
  migrated page (see `docs/setup-parity.md` for the drop reasons).

## Notes

- Images are served from Kyle's Cloudinary account (decision 2026-09-03); the images were
  already public on the lab's old docs site, and the local originals remain in
  `assets/setup/` as upload sources with their sha256 pinned in
  `data/cloudinary-manifest.json`.
- `assets/hippo.svg` (this site's brand mark, referenced by `index.html`) deliberately
  stays local, as do the 7 non-image download files (`.stl`/`.3mf`/`.pdf`) linked from the
  marker pages.
- Cloudinary's stored copies of the two GIFs are 29–41 bytes smaller than the local
  sources (metadata normalization on upload; format, dimensions, and animation intact —
  both verified serving HTTP 200 as `image/gif`).

## Per-page detail

### `contents/buttons/buttons` → `#/setup/guides/buttons` (1 image)

Old page: <https://hippocampusrobotics.github.io/docs/contents/buttons/buttons.html>

| Old image | Now served from |
|---|---|
| `_images/buttons.jpg` | <https://res.cloudinary.com/dr76gues0/image/upload/v1788428884/hippocampus-docs/setup/buttons.jpg> |

### `contents/gantry/general_information` → `#/setup/lab-gantry/general-information` (1 image)

Old page: <https://hippocampusrobotics.github.io/docs/contents/gantry/general_information.html>

| Old image | Now served from |
|---|---|
| `_images/gantry_reference_frame_annotation.jpg` | <https://res.cloudinary.com/dr76gues0/image/upload/v1788428897/hippocampus-docs/setup/gantry_reference_frame_annotation.jpg> |

### `contents/gantry/usage` → `#/setup/lab-gantry/usage` (6 images)

Old page: <https://hippocampusrobotics.github.io/docs/contents/gantry/usage.html>

| Old image | Now served from |
|---|---|
| `_images/gantry_gui_screenshot.png` | <https://res.cloudinary.com/dr76gues0/image/upload/v1788428892/hippocampus-docs/setup/gantry_gui_screenshot.png> |
| `_images/gantry_gui_screenshot.png` | <https://res.cloudinary.com/dr76gues0/image/upload/v1788428892/hippocampus-docs/setup/gantry_gui_screenshot.png> |
| `_images/gantry_mode_selection.png` | <https://res.cloudinary.com/dr76gues0/image/upload/v1788428893/hippocampus-docs/setup/gantry_mode_selection.png> |
| `_images/gantry_emergency_button_not_pressed.jpg` | <https://res.cloudinary.com/dr76gues0/image/upload/v1788428889/hippocampus-docs/setup/gantry_emergency_button_not_pressed.jpg> |
| `_images/gantry_emergency_button_pressed.jpg` | <https://res.cloudinary.com/dr76gues0/image/upload/v1788428890/hippocampus-docs/setup/gantry_emergency_button_pressed.jpg> |
| `_images/gantry_power_button.jpg` | <https://res.cloudinary.com/dr76gues0/image/upload/v1788428895/hippocampus-docs/setup/gantry_power_button.jpg> |

### `contents/getting_started/deploying_hippocampus` → `#/setup/getting-started/deploying-hippocampus` (1 image)

Old page: <https://hippocampusrobotics.github.io/docs/contents/getting_started/deploying_hippocampus.html>

| Old image | Now served from |
|---|---|
| `_images/hippo_inf_path.gif` | <https://res.cloudinary.com/dr76gues0/image/upload/v1788428847/hippocampus-docs/setup/hippo_inf_path.gif> |

### `contents/getting_started/px4_setup` → `#/setup/getting-started/px4-setup` (4 images)

Old page: <https://hippocampusrobotics.github.io/docs/contents/getting_started/px4_setup.html>

| Old image | Now served from |
|---|---|
| `_images/qgc_where_to_find_settings.png` | <https://res.cloudinary.com/dr76gues0/image/upload/v1788428918/hippocampus-docs/setup/qgc_where_to_find_settings.png> |
| `_images/qgc_manually_add_tcp_connection.png` | <https://res.cloudinary.com/dr76gues0/image/upload/v1788428914/hippocampus-docs/setup/qgc_manually_add_tcp_connection.png> |
| `_images/qgc_vehicle_setup.png` | <https://res.cloudinary.com/dr76gues0/image/upload/v1788428916/hippocampus-docs/setup/qgc_vehicle_setup.png> |
| `_images/qgc_sensors_setup.png` | <https://res.cloudinary.com/dr76gues0/image/upload/v1788428915/hippocampus-docs/setup/qgc_sensors_setup.png> |

### `contents/getting_started/starting_gazebo_simulation` → `#/setup/getting-started/starting-gazebo-simulation` (1 image)

Old page: <https://hippocampusrobotics.github.io/docs/contents/getting_started/starting_gazebo_simulation.html>

| Old image | Now served from |
|---|---|
| `_images/hippo_inf_path_in_simulation.gif` | <https://res.cloudinary.com/dr76gues0/image/upload/v1788428900/hippocampus-docs/setup/hippo_inf_path_in_simulation.gif> |

### `contents/hippocampus/motor_configuration` → `#/setup/hippocampus-bringup/motor-configuration` (1 image)

Old page: <https://hippocampusrobotics.github.io/docs/contents/hippocampus/motor_configuration.html>

| Old image | Now served from |
|---|---|
| `_images/thrusters.png` | <https://res.cloudinary.com/dr76gues0/image/upload/v1788428923/hippocampus-docs/setup/thrusters.png> |

### `contents/marker/design` → `#/setup/lab-marker/design` (1 image)

Old page: <https://hippocampusrobotics.github.io/docs/contents/marker/design.html>

| Old image | Now served from |
|---|---|
| `_images/IMG_2506.jpeg` | <https://res.cloudinary.com/dr76gues0/image/upload/v1788428871/hippocampus-docs/setup/IMG_2506.jpg> |

### `contents/marker/fabrication` → `#/setup/lab-marker/fabrication` (12 images)

Old page: <https://hippocampusrobotics.github.io/docs/contents/marker/fabrication.html>

| Old image | Now served from |
|---|---|
| `_images/IMG_2502.jpeg` | <https://res.cloudinary.com/dr76gues0/image/upload/v1788428864/hippocampus-docs/setup/IMG_2502.jpg> |
| `_images/IMG_2503.jpeg` | <https://res.cloudinary.com/dr76gues0/image/upload/v1788428866/hippocampus-docs/setup/IMG_2503.jpg> |
| `_images/IMG_2504.jpeg` | <https://res.cloudinary.com/dr76gues0/image/upload/v1788428867/hippocampus-docs/setup/IMG_2504.jpg> |
| `_images/IMG_2505.jpeg` | <https://res.cloudinary.com/dr76gues0/image/upload/v1788428869/hippocampus-docs/setup/IMG_2505.jpg> |
| `_images/IMG_2513.jpeg` | <https://res.cloudinary.com/dr76gues0/image/upload/v1788428874/hippocampus-docs/setup/IMG_2513.jpg> |
| `_images/IMG_2517.jpeg` | <https://res.cloudinary.com/dr76gues0/image/upload/v1788428876/hippocampus-docs/setup/IMG_2517.jpg> |
| `_images/IMG_2519.jpeg` | <https://res.cloudinary.com/dr76gues0/image/upload/v1788428878/hippocampus-docs/setup/IMG_2519.jpg> |
| `_images/IMG_2521.jpeg` | <https://res.cloudinary.com/dr76gues0/image/upload/v1788428880/hippocampus-docs/setup/IMG_2521.jpg> |
| `_images/IMG_2522.jpeg` | <https://res.cloudinary.com/dr76gues0/image/upload/v1788428881/hippocampus-docs/setup/IMG_2522.jpg> |
| `_images/IMG_2524.jpeg` | <https://res.cloudinary.com/dr76gues0/image/upload/v1788428883/hippocampus-docs/setup/IMG_2524.jpg> |
| `_images/IMG_2518.jpeg` | <https://res.cloudinary.com/dr76gues0/image/upload/v1788428877/hippocampus-docs/setup/IMG_2518.jpg> |
| `_images/IMG_2510.jpeg` | <https://res.cloudinary.com/dr76gues0/image/upload/v1788428873/hippocampus-docs/setup/IMG_2510.jpg> |

### `contents/qualisys/calibration` → `#/setup/lab-qualisys/calibration` (3 images)

Old page: <https://hippocampusrobotics.github.io/docs/contents/qualisys/calibration.html>

| Old image | Now served from |
|---|---|
| `_images/l_frame_in_tank.jpg` | <https://res.cloudinary.com/dr76gues0/image/upload/v1788428905/hippocampus-docs/setup/l_frame_in_tank.jpg> |
| `_images/calibration_orientation.png` | <https://res.cloudinary.com/dr76gues0/image/upload/v1788428886/hippocampus-docs/setup/calibration_orientation.png> |
| `_images/calibration_translation.png` | <https://res.cloudinary.com/dr76gues0/image/upload/v1788428887/hippocampus-docs/setup/calibration_translation.png> |

### `contents/qualisys/defining_bodies` → `#/setup/lab-qualisys/defining-bodies` (2 images)

Old page: <https://hippocampusrobotics.github.io/docs/contents/qualisys/defining_bodies.html>

| Old image | Now served from |
|---|---|
| `_images/hippocampus_markers.JPG` | <https://res.cloudinary.com/dr76gues0/image/upload/v1788428902/hippocampus-docs/setup/hippocampus_markers.jpg> |
| `_images/rotate_6dof_body.png` | <https://res.cloudinary.com/dr76gues0/image/upload/v1788428920/hippocampus-docs/setup/rotate_6dof_body.png> |

### `contents/raspberry_pi_setup/pinout` → `#/setup/raspberry-pi/pinout` (4 images)

Old page: <https://hippocampusrobotics.github.io/docs/contents/raspberry_pi_setup/pinout.html>

| Old image | Now served from |
|---|---|
| `_images/pi_pinout_uuv.svg` | <https://res.cloudinary.com/dr76gues0/image/upload/v1788428836/hippocampus-docs/setup/pi_pinout_uuv.svg> |
| `_images/pi_pinout_bluerov.svg` | <https://res.cloudinary.com/dr76gues0/image/upload/v1788428906/hippocampus-docs/setup/pi_pinout_bluerov.svg> |
| `_images/pi_pinout_gantry.svg` | <https://res.cloudinary.com/dr76gues0/image/upload/v1788428911/hippocampus-docs/setup/pi_pinout_gantry.svg> |
| `_images/pi_pinout_buttons.svg` | <https://res.cloudinary.com/dr76gues0/image/upload/v1788428909/hippocampus-docs/setup/pi_pinout_buttons.svg> |

### `contents/raspberry_pi_setup/uart_configuration` → `#/setup/raspberry-pi/uart-configuration` (3 images)

Old page: <https://hippocampusrobotics.github.io/docs/contents/raspberry_pi_setup/uart_configuration.html>

| Old image | Now served from |
|---|---|
| `_images/pi_pinout_uuv.svg` | <https://res.cloudinary.com/dr76gues0/image/upload/v1788428836/hippocampus-docs/setup/pi_pinout_uuv.svg> |
| `_images/pi_pinout_bluerov.svg` | <https://res.cloudinary.com/dr76gues0/image/upload/v1788428906/hippocampus-docs/setup/pi_pinout_bluerov.svg> |
| `_images/pi_pinout_gantry.svg` | <https://res.cloudinary.com/dr76gues0/image/upload/v1788428911/hippocampus-docs/setup/pi_pinout_gantry.svg> |
