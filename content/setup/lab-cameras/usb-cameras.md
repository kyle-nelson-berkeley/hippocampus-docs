# USB Cameras


## MJPEG Capturing


There is the [v4l2_camera](https://gitlab.com/boldhearts/ros2_v4l2_camera) package, that provides a V4L2 camera driver using the standard `image_transport` pipeline.


Unfortunately, this interface provides no way of directly capturing and publishing JPEG compressed images (i.e. a JPEG image is captured, decoded to a raw image and then recompressed as JPEG if the `image_raw/compressed` topic is subscribed).


This substantial overhead can be avoided with our `mjpeg_cam` package.



### Get Available Capture Formats


```console
$ v4l2-ctl --list-formats-ext
ioctl: VIDIOC_ENUM_FMT
   Type: Video Capture

   [0]: 'MJPG' (Motion-JPEG, compressed)
      Size: Discrete 1280x720
         Interval: Discrete 0.033s (30.000 fps)
         Interval: Discrete 0.067s (15.000 fps)
      Size: Discrete 960x540
         Interval: Discrete 0.033s (30.000 fps)
         Interval: Discrete 0.067s (15.000 fps)
      Size: Discrete 848x480
         Interval: Discrete 0.033s (30.000 fps)
   [1]: 'YUYV' (YUYV 4:2:2)
      Size: Discrete 640x480
         Interval: Discrete 0.033s (30.000 fps)
         Interval: Discrete 0.067s (15.000 fps)
      Size: Discrete 640x360
         Interval: Discrete 0.033s (30.000 fps)
         Interval: Discrete 0.067s (15.000 fps)
      Size: Discrete 424x240
         Interval: Discrete 0.033s (30.000 fps)
         Interval: Discrete 0.067s (15.000 fps)
      Size: Discrete 320x240
         Interval: Discrete 0.033s (30.000 fps)
         Interval: Discrete 0.067s (15.000 fps)
      Size: Discrete 320x180
         Interval: Discrete 0.033s (30.000 fps)
         Interval: Discrete 0.067s (15.000 fps)
      Size: Discrete 160x120
         Interval: Discrete 0.033s (30.000 fps)
         Interval: Discrete 0.067s (15.000 fps)
```

We can choose a combination of frame size and frame intervals listed under the `MJPG` pixel format.


<p class="provenance">Migrated from the previous docs site: <a href="https://hippocampusrobotics.github.io/docs/contents/cameras/usb_cameras.html">contents/cameras/usb_cameras</a>.</p>
