# Pre-built Packages


For convenience, we provide our own packages as pre-built binaries at [repositories.hippocampus-robotics.net](https://repositories.hippocampus-robotics.net). The advantage is that we do **not** need to compile the packages we are not developing actively ourselfs.


<div class="adm adm-note"><p class="adm-title">Note</p>

Packages in a local workspace have a higher priority than the ones installed in `/opt/ros/` via debian packages. So we can install all our packages via `apt install` and still use a custom/modifed version of them by having them included in our workspace.



</div>

<div class="adm adm-note"><p class="adm-title">Note</p>

In case that we do not wish to install the pre-built binaries, it is perfectly fine to skip this part and clone all the required packages into our workspace and build them on our own.



</div>

## Add Sources


1. Adding the key


    ```console
    $ sudo curl https://repositories.hippocampus-robotics.net/hippo-archive.key -o /etc/apt/keyrings/hippocampus-robotics.asc
    ```

2. Adding the sources


    ```console
    $ echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/hippocampus-robotics.asc] https://repositories.hippocampus-robotics.net/ubuntu $(. /etc/os-release && echo $UBUNTU_CODENAME) main" | sudo tee /etc/apt/sources.list.d/hippocampus.list
    ```

3. Updating `apt`


    ```console
    $ sudo apt update
    ```


`rosdep` ==========


1. Add keys for `rosdep` so it knows that our packages can be resolved via `apt install ros-${ROS_DISTRO}-<pkg-name>`.


    <div class="adm adm-attention"><p class="adm-title">Attention</p>

    Make sure that `ROS_DISTRO` is set to the installed ROS version. If you followed [the previous section](#/setup/getting-started/ros-installation), this should already be done. It can be checked by


    ```console
    $ echo $ROS_DISTRO
    jazzy # (or whatever ROS version is used.)
    ```

    If it not set, it can be set manually by


    ```console
    $ export ROS_DISTRO=jazzy
    ```


    </div>

    ```console
    $ echo "yaml https://raw.githubusercontent.com/HippoCampusRobotics/hippo_infrastructure/main/rosdep-${ROS_DISTRO}.yaml" | sudo tee /etc/ros/rosdep/sources.list.d/50-hippocampus-packages.list
    ```

2. Apply the changes


    ```console
    $ rosdep update
    ```


## Installation


For use on a desktop computer, you can install `hippo_full`.


On Raspberry Pis (deployed with the Ubuntu server image), the `hippo_robot` package without graphical dependencies is the better choice.


<div class="tabs">

<div class="tab" data-label="hippo_full">

```console
$ sudo apt install ros-${ROS_DISTRO}-hippo-full
```

</div>

<div class="tab" data-label="hippo_robot">

```console
$ sudo apt install ros-${ROS_DISTRO}-hippo-robot
```

</div>


</div>

For more details on the concept of pre-built packages see [here](#/setup/concepts/pre-built-packages).


<p class="provenance">Migrated from the previous docs site: <a href="https://hippocampusrobotics.github.io/docs/contents/getting_started/pre-built_packages.html">contents/getting_started/pre-built_packages</a>.</p>
