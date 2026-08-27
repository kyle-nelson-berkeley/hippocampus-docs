# Event Cameras


## Driver


<div class="adm adm-note"><p class="adm-title">Note</p>

This is a getting-started-quickly guide, more complete instructions are documented in the repository's [README](https://github.com/ros-event-camera/libcaer_driver/).



</div>

Define the workspace path


```console
$ WS_DIR="$HOME/ros2_underlay/src"
```

go to the workspace


```console
$ cd $WS_DIR
```

clone the repository and its dependencies


```console
$ git clone https://github.com/ros-event-camera/libcaer_driver.git \
&& vcs import < libcaer_driver/libcaer_driver.repos
```

Install the remaining dependencies


```console
$ rosdep-underlay
```

Build


```console
$ build_underlay
```

### Repower USB


After booting the camera is often not found. Switching off and on again fixes the problem.


This can be done with [uhubctl](https://github.com/mvp/uhubctl).


Installation

```console
$ git clone https://github.com/mvp/uhubctl.git \
&& cd uhubctl \
&& make \
&& sudo make install
```

Off

```console
$ sudo uhubctl -l 2 -a 0
```

On

```console
$ sudo uhubctl -l 2 -a 1
```

### Launch


```console
$ ros2 launch libcaer_driver driver_node.launch.py device_type:=dvxplorer
```

## Renderer


Only required to visualize the event camera data as frames. **Not** required to be installed on the Raspberry Pi.


Define the workspace path


```console
$ WS_DIR="$HOME/ros2_underlay/src"
```

go to the workspace and clone the repository and its dependencies


```console
$ cd $WS_DIR \
&& git clone https://github.com/ros-event-camera/event_camera_renderer.git \
&& vcs import < event_camera_renderer/event_camera_renderer.repos
```

Install the remaining dependencies


```console
$ rosdep-underlay
```

Build


```console
$ build_underlay
```

### Launch


```console
$ ros2 launch event_camera_renderer renderer.launch.py camera:=uuv02/event_camera
```


<p class="provenance">Migrated from the previous docs site: <a href="https://hippocampusrobotics.github.io/docs/contents/cameras/event_cameras.html">contents/cameras/event_cameras</a>.</p>
