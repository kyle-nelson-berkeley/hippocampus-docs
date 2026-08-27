# Misc


## x2go


### Fix GLX Issues with rviz2


1. Install dependencies


    ```console
    $ sudo apt install libxcb-randr0-dev meson ninja-build byacc flex
    ```

2. Enable source code in **Additional Drivers** and download with


    ```console
    $ apt-get source mesa
    ```

3. Inside the mesa directory execute


    ```console
    $ mkdir build && cd build && \
    meson -D glx=xlib -D gallium-drivers=swrast -D platforms=x11 -D dri3=false -D dri-drivers="" -D vulkan-drivers="" -D buildtype=release -D optimization=3
    ```

    and run


    ```console
    $ ninja
    ```

4. Copy `libgl-xlib` somewhere, e.g. the home directory


    ```console
    $ sudo cp -r src/gallium/targets/libgl-xlib /
    ```


To run `gazebo` or `rviz`, we need a wrapper. The [x2go Wiki](https://wiki.x2go.org/doku.php/wiki:development:glx-xlib-workaround) proposes two different solutions, where only the latter works for `gazebo` and `rviz`.


<div class="tabs">

<div class="tab" data-label="x2goglx">

```sh
#!/bin/sh
LD_LIBRARY_PATH="$HOME/libgl-xlib:${LD_LIBRARY_PATH}" exec "$@"
```

</div>

<div class="tab" data-label="x2goglx2">

```sh
#!/bin/sh
LD_PRELOAD="$HOME/libgl-xlib/libGL.so.1" exec "$@"
```

</div>


</div>

<div class="adm adm-todo"><p class="adm-title">To do</p>

Check if also the second solution can be added as `export` in `.zshrc`.



</div>

## Forward Gamepad


<div class="tabs">

<div class="tab" data-label="F710">

```console
$ cat /proc/bus/input/devices | awk '/F710/' RS= | grep -E 'Name=|event[0-9]+'
```

```console
$ EVENT_DEVICE='dev/input/event2'
```

[Terminal recording on the old site](https://hippocampusrobotics.github.io/docs/contents/misc/misc.html)


</div>

<div class="tab" data-label="Everything">

```console
$ cat /proc/bus/input/devices | grep -E 'Name=|event[0-9]+' 
```

```console
$ EVENT_DEVICE='dev/input/event2'
```

[Terminal recording on the old site](https://hippocampusrobotics.github.io/docs/contents/misc/misc.html)


</div>


</div>

<div class="adm adm-note"><p class="adm-title">Note</p>

Replace the hostname/IP address of the remote target.



</div>

```console
$ REMOTE_ADDRESS='XXX.XXX.XXX.XXX'
```

```console
$ REMOTE_USER='remote_user_name'
```

```console
$ python -u ~/input-over-ssh/input_over_ssh/client.py -p ${EVENT_DEVICE} | ssh ${REMOTE_USER}@${REMOTE_ADDRESS} -t 'bash -c "python3 -u ~/input-over-ssh/input_over_ssh/server.py"'
```

On the remote target you can start the joy node.


```console
$ ros2 run joy joy_node --ros-args -p device_name:='Logitech Gamepad F710 (via input-over-ssh)'
```

<div class="adm adm-note"><p class="adm-title">Note</p>

For some reason it takes very long (up to a minute) for the joy node to detect the joystick device.



</div>

We can expect the node to publish messages as soon as it ouputs the following line:


```console
[INFO] [...] [joy_node]: Opened joystick: Logitech Gamepad F710 (via input-over-ssh).  deadzone: 0.050000
```


<p class="provenance">Migrated from the previous docs site: <a href="https://hippocampusrobotics.github.io/docs/contents/misc/misc.html">contents/misc/misc</a>.</p>
