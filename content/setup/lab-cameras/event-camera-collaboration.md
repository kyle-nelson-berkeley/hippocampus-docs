# Event Camera Collaboration


<div class="adm adm-note"><p class="adm-title">Note</p>

The folloing instructions are targeting ROS2 because our whole framework is implemented in ROS2. The `ros-event-camera` packages are available for ROS1 **and** ROS2, though. All following instructions have ROS1 equivalents and should be fairly easy to adapt if required.



</div>

## The Framework


We use the packages from the `ros-event-camera` [GitHub project](https://github.com/ros-event-camera/). All packages should be available for both ROS1 and ROS2. The `libcaer_driver` package is a generic ROS interface for sensors that communicate via `libcaer`. The `event_camera_msgs` and `event_camera_codecs` provide a very efficient way of encoding the sensor event data (see the [README](https://github.com/ros-event-camera/libcaer_driver/) for details).


## The Bag Files


The vehicle name used in our set up is `uuv02`, hence all vehicle related topic names are prefixed with `uuv02`.


### Converting `mcap` to `sqlite3`


Create a a `yaml` file


```yaml
output_bags:
  - uri: <output_name>
    storage_id: sqlite3
    all: true
```

and run


```console
$ ros2 bag convert -i <BAGFILE_IN_MCAP_FORMAT> -o output.yaml
```

### With Gantry


```console
$ ros2 bag info gantry_lemniscate_v_0.1

Files:             gantry_lemniscate_v_0.1_0.mcap
Bag size:          1.0 GiB
Storage id:        mcap
Duration:          204.246s
Start:             Feb  7 2024 17:40:23.450 (1707327623.450)
End:               Feb  7 2024 17:43:47.696 (1707327827.696)
Messages:          206770
Topic information: Topic: /uuv02/event_camera/imu | Type: sensor_msgs/msg/Imu | Count: 165290 | Serialization Format: cdr
                   Topic: /uuv02/event_camera/events | Type: event_camera_msgs/msg/EventPacket | Count: 20328 | Serialization Format: cdr
                   Topic: /gantry/motor_y/position | Type: gantry_msgs/msg/MotorPosition | Count: 2034 | Serialization Format: cdr
                   Topic: /gantry/motor_x/position | Type: gantry_msgs/msg/MotorPosition | Count: 2034 | Serialization Format: cdr
                   Topic: /uuv02/vertical_camera/image_raw/compressed | Type: sensor_msgs/msg/CompressedImage | Count: 6871 | Serialization Format: cdr
                   Topic: /uuv02/odometry | Type: nav_msgs/msg/Odometry | Count: 10213 | Serialization Format: cdr
```

The gantry position is published in the topics `/gantry/motor_x/position` and `gantry/motor_y/position`. Event camera data is published as `/uuv02/event_camera/events` and `/uuv02/event_camera/imu`.


### Without Gantry


```console
$ ros2 bag info onboard_lemniscate_v_0.3/

Files:             onboard_lemniscate_v_0.3_0.mcap
Bag size:          1014.5 MiB
Storage id:        mcap
Duration:          105.250s
Start:             Feb  7 2024 17:59:27.763 (1707328767.763)
End:               Feb  7 2024 18:01:13.14 (1707328873.14)
Messages:          105150
Topic information: Topic: /uuv02/event_camera/imu | Type: sensor_msgs/msg/Imu | Count: 83939 | Serialization Format: cdr
                   Topic: /uuv02/event_camera/events | Type: event_camera_msgs/msg/EventPacket | Count: 10323 | Serialization Format: cdr
                   Topic: /gantry/motor_y/position | Type: gantry_msgs/msg/MotorPosition | Count: 1042 | Serialization Format: cdr
                   Topic: /gantry/motor_x/position | Type: gantry_msgs/msg/MotorPosition | Count: 1043 | Serialization Format: cdr
                   Topic: /uuv02/odometry | Type: nav_msgs/msg/Odometry | Count: 5262 | Serialization Format: cdr
                   Topic: /uuv02/vertical_camera/image_raw/compressed | Type: sensor_msgs/msg/CompressedImage | Count: 3541 | Serialization Format: cdr
```

As long as our Qualisys cameras are still(!) in service, we have to rely on the onboard visual localization. The estimated pose and velocity is published as `/uuv02/odometry`. The event camera specific topics are the same as for the gantry setup.


## Reading the Data


### Concept


We have prepared a basic example in ROS2 on how to to read the event_camera data. Porting the code to ROS1 should be fairly easy and you can probably grasph the concept of it even though it is written for the ROS2 API.


```console
$ git clone https://github.com/HippoCampusRobotics/event_camera_example.git
```

This depends on the above mentioned [event_camera_codecs](https://github.com/ros-event-camera/event_camera_codecs) and [event_camera_msgs](https://github.com/ros-event-camera/event_camera_msgs).


Depending on your workflow, the dependency on `dv-processing` is not required. In the example code, we show an example on how to store the ROS message data as `dv::EventPacket`. If you want to work with the raw events directly, you can omit this conversion and operate on the event data inside the `eventCD()` callback (`include/event_camera_example/event_updater.hpp`) without creating the `dv::EventPacket`.


<div class="adm adm-note"><p class="adm-title">Note</p>

Inivation provides their software as prebuilt packages for 20.04 and 22.04 via their [PPA](https://launchpad.net/~inivation-ppa/+archive/ubuntu/inivation). They store their non-system-default version of boost in a separate directory and [instruct CMAKE](https://launchpad.net/~inivation-ppa/+archive/ubuntu/inivation) to use this boost version. This could be a more convenient way of avoiding boost version conflicts without the need to install anything manually besiders the inivation packages.




</div>

### Run the Example


Play the bag file


```console
$ ros2 bag play <PATH_TO_THE_MCAP_FILE>
```

```console
$ ros2 run event_camera_example example_node --ros-args -r __ns:=/uuv02
.
.
.
[INFO] [1707470874.889379640] [event_updater]: First event sensor time of current packet: 1707327667717551000 + 0
[INFO] [1707470874.890289337] [event_updater]: EventPacket message contained 12894 events.
[INFO] [1707470874.890313394] [uuv02.example_node]: I have a dv::EventPacket with 12894 events
```

## Visualizing the Events


The [event_camera_renderer](https://github.com/ros-event-camera/event_camera_renderer/) creates images from events. We can launch it via


```console
$ ros2 launch event_camera_renderer renderer.launch.py camera:=uuv02/event_camera
```

and we can then view the rendered image via `rqt_image_view`.



<p class="provenance">Migrated from the previous docs site: <a href="https://hippocampusrobotics.github.io/docs/contents/cameras/event_camera_collaboration.html">contents/cameras/event_camera_collaboration</a>.</p>
