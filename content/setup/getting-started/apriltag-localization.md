# Apriltag Localization



This page explains how to start and check the AprilTag localization setup.


The setup is used to estimate the vehicle pose from AprilTags observed by a camera. For the BlueROV, the usual localization setup uses the `vertical_camera`. The BlueROV also has a `front_camera` that has been mostly used for the Formulas and Vehicles class. HippoCampus only has one `vertical_camera`.


The image transport pipeline is intentionally split between the robot and the offboard computer:


```text
robot / camera Pi:
  image_raw/compressed
  camera_info

offboard PC:
  image_decoder:
    image_raw/compressed -> image_raw

  rectifier:
    image_raw + camera_info -> image_rect

  apriltag_node:
    image_rect + camera_info -> detections + tag_transforms

  vision_ekf_node:
    tag_transforms + known tag poses -> vision_pose_cov
```

The compressed image is sent over the network. The raw and rectified images should usually only be used on the offboard computer.



## Supported Setups


There are three main launch files.


| Launch file | Use case | Default camera |
|---|---|---|
| `top_localization.launch.py` | Standard AprilTag localization | `vertical_camera` |
| `top_localization_for_sems.launch.py` | Class setup. Includes the standard localization launch and additionally starts the vehicle TF publisher. | `vertical_camera` |
| `top_ranges.launch.py` | BlueROV front-camera range setup | `front_camera` |

<div class="adm adm-note"><p class="adm-title">Note</p>

`top_ranges.launch.py` is intended for the BlueROV `front_camera` setup. Do not use it as the normal vertical-camera localization launch.



</div>

## Launch Arguments


Check the available launch arguments with:


```bash
ros2 launch visual_localization top_localization.launch.py --show-args
ros2 launch visual_localization top_localization_for_sems.launch.py --show-args
ros2 launch visual_localization top_ranges.launch.py --show-args
```

## Start the Robot Camera


First, start the normal robot setup. For the BlueROV, use the usual hardware launch on the Raspberry Pi that hosts the selected camera.


For the vertical camera, check that the compressed image and camera info are available:


```bash
ros2 topic list -t | grep vertical_camera
```

Expected before starting the localization launch:


```text
/bluerov01/vertical_camera/camera_info [sensor_msgs/msg/CameraInfo]
/bluerov01/vertical_camera/image_raw/compressed [sensor_msgs/msg/CompressedImage]
```

Check the rate and bandwidth:


```bash
ros2 topic hz /bluerov01/vertical_camera/image_raw/compressed
ros2 topic bw /bluerov01/vertical_camera/image_raw/compressed
ros2 topic info /bluerov01/vertical_camera/image_raw/compressed -v
```

Do not expect `image_raw` or `image_rect` to exist yet. These are created by the offboard decoder and rectifier.



## Launch Setups


<div class="tabs">

<div class="tab" data-label="Standard Localization">

Use this for the normal AprilTag localization setup.


```bash
ros2 launch visual_localization top_localization.launch.py \
   vehicle_name:=bluerov01 \
   use_sim_time:=false
```

To enable the AprilTag overlay image:


```bash
ros2 launch visual_localization top_localization.launch.py \
   vehicle_name:=bluerov01 \
   use_sim_time:=false \
   use_apriltag_viz:=true
```

The standard launch expects the required vehicle TF tree to already be available. It does not start the vehicle TF publisher.



</div>

<div class="tab" data-label="SEMS/FAV Setup for BlueROV">

```bash
ros2 launch visual_localization top_localization_for_sems.launch.py \
   vehicle_name:=bluerov01 \
   use_sim_time:=false
```

This launch file includes `top_localization.launch.py` and additionally starts the vehicle TF publisher. It also starts the AprilTag overlay image by default.


Use this launch when the normal robot TF publisher is not already running.


<div class="adm adm-attention"><p class="adm-title">Attention</p>

Do not start two vehicle TF publishers for the same vehicle unless this is intentional. Duplicate node names or duplicate TF publishers can make debugging difficult.



</div>


</div>

<div class="tab" data-label="Front Camera Ranges Setup (Assignment 2 SEMS/FAV)">

```bash
ros2 launch visual_localization top_ranges.launch.py \
   vehicle_name:=bluerov01 \
   use_sim_time:=false
```

This launch uses `front_camera` and `apriltag_ranges_config.yaml` by default.


Check:


```bash
ros2 node list | grep front_camera
ros2 topic list -t | grep front_camera
```

Expected topics include:


```text
/bluerov01/front_camera/image_raw/compressed
/bluerov01/front_camera/image_raw
/bluerov01/front_camera/image_rect
/bluerov01/front_camera/detections
/bluerov01/front_camera/tag_transforms
/bluerov01/front_camera/tag_detections_image
```

<div class="adm adm-attention"><p class="adm-title">Attention</p>

This Launch setup is meant only for the front camera of the BlueROV. It is used to detect tags at the front wall of the tank.





</div>


</div>


</div>

## Check the Image Pipeline


After starting localization, check the vertical-camera pipeline:


```bash
ros2 topic list -t | grep vertical_camera
```

Expected topics include:


```text
/bluerov01/vertical_camera/image_raw/compressed
/bluerov01/vertical_camera/image_raw
/bluerov01/vertical_camera/image_rect
/bluerov01/vertical_camera/detections
/bluerov01/vertical_camera/tag_transforms
```

Check the node connections:


```bash
ros2 node info /bluerov01/vertical_camera/rectifier
ros2 node info /bluerov01/vertical_camera/apriltag_node
```

Expected:


```text
rectifier subscribes:
  image_raw
  camera_info

rectifier publishes:
  image_rect

apriltag_node subscribes:
  image_rect
  camera_info

apriltag_node publishes:
  detections
  tag_transforms
```

The AprilTag detector publishes `detections` at camera rate even if no tags are detected. Empty detections do not necessarily mean that the image pipeline is broken.


## Display the Camera Image


On the offboard PC running the decoder, display the rectified image:


```bash
ros2 run rqt_image_view rqt_image_view
```

Select:


```text
/bluerov01/vertical_camera/image_rect
```

This is the image used by the AprilTag detector.


If the AprilTag visualization node is running, display:


```text
/bluerov01/vertical_camera/tag_detections_image
```

This image overlays detected tags on the rectified image.


<div class="adm adm-attention"><p class="adm-title">Attention</p>

Do not subscribe to raw image topics from another computer unless this is intentional. Raw image topics can create high network load. For remote viewing, prefer compressed image transport.



</div>

## Check Detections


Show the detection messages:


```bash
ros2 topic echo /bluerov01/vertical_camera/detections --once
```

Show the tag transforms:


```bash
ros2 topic echo /bluerov01/vertical_camera/tag_transforms --once
```

Check that the detected tag IDs are present in the configured `tag_poses_file`.


Also check that there is only one AprilTag publisher:


```bash
ros2 topic info /bluerov01/vertical_camera/tag_transforms -v
```

Expected:


```text
Publisher count: 1
Node name: apriltag_node
Node namespace: /bluerov01/vertical_camera
```

If there is more than one publisher, an old launch process may still be running.


## AprilTag Wrapper Convention


There are two AprilTag ROS setups in use:


```text
old HippoCampus fork
released apriltag_ros wrapper
```

The wrapper that is used depends on the sourced workspace. Check it with:


```bash
ros2 pkg prefix apriltag_ros
```

If this points to `/opt/ros/jazzy`, the released package is used. If it points to a workspace such as `ros2_underlay`, the local fork is used.


The tag frame convention can differ between wrappers and pose estimation methods. The EKF therefore applies a fixed correction from the detected tag frame convention to the tag frame convention used in `tag_poses.yaml`.


For the old fork, use:


```yaml
tag_frame_correction_rpy_deg: [0.0, 0.0, 0.0]
```

For the released wrapper with `pose_estimation_method: pnp`, use:


```yaml
tag_frame_correction_rpy_deg: [180.0, 0.0, 0.0]
```

This correction is independent of the camera transform. It only converts between tag-frame axis conventions.


## Troubleshooting


`image_raw` does not exist ^^^^^^^^^^^^^^^^^^^^^^^^^^^^


The image decoder is not running or is in the wrong namespace.


Check:


```bash
ros2 node list | grep image_decoder
```

Manual decoder test:


```bash
ros2 run visual_localization image_decoder --ros-args \
  -r __ns:=/bluerov01/vertical_camera
```

`image_rect` does not exist ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


The rectifier is not running, `image_raw` is missing, or `camera_info` is missing.


Check:


```bash
ros2 node info /bluerov01/vertical_camera/rectifier
```

`detections` publishes but contains no tags ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


Possible reasons:


```text
no tag visible
wrong tag family
wrong tag size
tag too small in the image
bad lighting or motion blur
wrong camera calibration
wrong tag config
```

`tag_transforms` has more than one publisher ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


This usually means that an old AprilTag process is still running.


Check:


```bash
ros2 topic info /bluerov01/vertical_camera/tag_transforms -v
ps aux | grep apriltag_node | grep -v grep
```

Clean stale vertical-camera nodes:


```bash
pkill -f "apriltag_node.*__ns:=/bluerov01/vertical_camera"
pkill -f "vision_ekf_node.*__ns:=/bluerov01/vertical_camera"
pkill -f "apriltag_viz.*__ns:=/bluerov01/vertical_camera"
pkill -f "image_decoder.*__ns:=/bluerov01/vertical_camera"
pkill -f "topic_tools.*relay.*__ns:=/bluerov01/vertical_camera"
```

Use `pkill -f` carefully. It kills all matching processes.


### Duplicate node names


Check exact duplicates:


```bash
ros2 node list | sort | uniq -d
```

Check running localization-related processes:


```bash
ps aux | grep -E "apriltag_node|vision_ekf_node|apriltag_viz|image_decoder|ranges|relay|component_container" | grep -v grep
```

If no stale processes remain but the ROS graph still looks wrong, restart the ROS daemon:


```bash
ros2 daemon stop
ros2 daemon start
```

`rqt` shows a compressed topic in red ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


Do not directly select:


```text
/bluerov01/vertical_camera/image_raw/compressed
```

as a raw image topic in `rqt_image_view`. Select the base topic with compressed transport if needed, or view the decoded/rectified image on the offboard computer.


For AprilTag debugging, prefer:


```text
/bluerov01/vertical_camera/image_rect
```

or:


```text
/bluerov01/vertical_camera/tag_detections_image
```


<p class="provenance">Migrated from the previous docs site: <a href="https://hippocampusrobotics.github.io/docs/contents/getting_started/apriltag_localization.html">contents/getting_started/apriltag_localization</a>.</p>
