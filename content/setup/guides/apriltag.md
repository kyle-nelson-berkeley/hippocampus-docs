# AprilTag


There is a [PR](https://github.com/AprilRobotics/apriltag_ros/pull/114) for porting the good old `apriltag_ros` package to ROS2.


```sh
https://github.com/wep21/apriltag_ros/tree/ros2-port/apriltag_ros
```

You will have to clone this package and manually switch to the the `ros2-port` branch afterwards.


There is an alternative [package](https://github.com/christianrauch/apriltag_ros) by Christian Rauch, that works somewhat different but has a simpler code base. Unfortunately it does not support tag bundles.



## Generate Parameter Files


To either select the tags, that should be detected, or create a tag bundle configuration, run


```console
$ ros2 run hippo_sim generate_tag_poses.py --out-dir `pwd`
```

to create the corresponding files in the current directory.


To show the list of available arguments run


```console
$ ros2 run hippo_sim generate_tag_poses.py -h
```


<p class="provenance">Migrated from the previous docs site: <a href="https://hippocampusrobotics.github.io/docs/contents/ros2/apriltag.html">contents/ros2/apriltag</a>.</p>
