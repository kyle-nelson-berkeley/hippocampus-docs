# Full UVMS Setup



<div class="adm adm-todo"><p class="adm-title">To do</p>

Add all relevant infos. Appropriate structures + titles of sections TBD.




</div>

## Installation Setup


Ubuntu 24.04 + ROS2 Jazzy - see [ROS installation](#/setup/getting-started/ros-installation)


### What packages are needed?


We have most of our packages available as pre-built packages - see [pre-built-packages](#/setup/getting-started/pre-built-packages)


The easiest is probably to install all, e.g. `hippo_full`


```console
$ sudo apt install ros-${ROS_DISTRO}-hippo-full
```

Alternatively, install them separately. These should be necessary:


- hippo_common

- hippo_sim

- hippo_gz_plugins

- hippo_msgs

- hippo_control_msgs

- uvms_msgs

- alpha_msgs


Example:


```console
$ sudo apt install ros-${ROS_DISTRO}-hippo-sim
```

The private repository `alpha_arm` is not available via apt (for obvious reasons) and needs to be cloned and build from source.


The package `uvms` also needs to be build from source.


<p class="provenance">Migrated from the previous docs site: <a href="https://hippocampusrobotics.github.io/docs/contents/bluerov/full_uvms_setup.html">contents/bluerov/full_uvms_setup</a>.</p>
