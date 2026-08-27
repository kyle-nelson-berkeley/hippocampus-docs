# Usage


## Run the xyz Setup


On the Raspberry Pi on the gantry ( `ssh pi@gantry.local` ), run:


```console
$ ros2 launch gantry xyz_motors.launch.py
```

This will start the three motors for the x-, y-, and z-axis, respectively. The configuration files for the motors are found in `gantry/config/motor_<axis_name>.yaml`.


If you encounter any error messages, e.g. time outs, just keep repeating the launch command... a reboot of the Raspberry Pi ( `sudo reboot` ) or a reboot of the entire setup (see below) can help, too. Eventually, all 3 motors should work. TODO: this needs to be fixed.


Example for timeout errror for x-axis motor:


```console
pi@gantry ~
$ ros2 launch gantry xyz_motors.launch.py
[INFO] [launch]: All log files can be found below /home/pi/.ros/log/2025-06-11-13-28-20-755904-gantry-5649
[INFO] [launch]: Default logging verbosity is set to INFO
[INFO] [xyz_motors-1]: process started with pid [5687]
[xyz_motors-1] [INFO] [1749641301.578167645] [xyz_motor]: Created x axis motor.
[xyz_motors-1] [INFO] [1749641301.578849939] [xyz_motor]: Created y axis motor.
[xyz_motors-1] [INFO] [1749641301.579263456] [xyz_motor]: Created z axis motor.
[xyz_motors-1] [ERROR] [1749641301.944969580] [motor_interface]: Read timed out.
[xyz_motors-1] [FATAL] [1749641301.945241672] [gantry.motor_x]: Could not read motor position. Are all wires connected properly? Is the motor powered (relay box)?
[xyz_motors-1] [FATAL] [1749641301.945584319] [gantry.motor_x]: Node will be inactive.
[xyz_motors-1] [INFO] [1749641302.049688477] [gantry.motor_y]: Initialized.
[xyz_motors-1] [INFO] [1749641302.053621334] [gantry.motor_z]: Initialized.
```

## Enable the Motors


If the motors are enabled, you should not be able to move the x- and y-axis by hand. Do NOT test this for the z-axis! If you want to move one of the linear axis by hand, you have to turn the power supply off.


Sometimes, one of the motors is not automatically enabled again after turning the power supply back on. This tends to happen to the y-axis. You can check the motor status:


```console
pi@gantry ~
$ ros2 topic echo /gantry/motor_y/motor_status          
header:
  stamp:
    sec: 1787840867
    nanosec: 376819798
  frame_id: ''
homing: false
lower_limit_switch_pressed: false
upper_limit_switch_pressed: false
enabled: false
position_reached: true
```

To manually enable a motor, in this example the y-axis, use:


```console
pi@gantry ~
$ ros2 service call /gantry/motor_y/enable std_srvs/srv/SetBool "{data: True}"
requester: making request: std_srvs.srv.SetBool_Request(data=True)

response:
std_srvs.srv.SetBool_Response(success=True, message='')
```

As a physical check, now the axis should not be movable by hand anymore.



## Home the Motors


<div class="adm adm-important"><p class="adm-title">Important</p>

Always make sure that the motors are homed before sending any setpoints!



</div>

<div class="adm adm-note"><p class="adm-title">Note</p>

The motor position is stored inside the motion controller and not inside any code running on the Raspberry Pi or any ROS node. Relaunching any node does **not** make it necessary to rerun the homing procedure 🥳.



</div>

<div class="tabs">

<div class="tab" data-label="Homing Using the GUI">

1. Run the GUI (see [Run (and use) the GUI](#/setup/lab-gantry/usage@run-and-use-the-gui))


![gantry gui screenshot](assets/setup/gantry_gui_screenshot.png)

1. Press the "Go Home" Button for each axis. The motors should start homing.

2. Once each motor has reached its lower limit, press "Set Position" for each axis.



</div>

<div class="tab" data-label="Homing Using the Command Line">

1. Move the motors to the home position.


    The motors provide a service to move to the home position.


    <div class="tabs">

    <div class="tab" data-label="x">

    ```console
    $ ros2 service call /gantry/motor_x/start_homing std_srvs/srv/Trigger{}
    ```

    </div>

    <div class="tab" data-label="y">

    ```console
    $ ros2 service call /gantry/motor_y/start_homing std_srvs/srv/Trigger {}
    ```

    </div>

    <div class="tab" data-label="z">

    ```console
    $ ros2 service call /gantry/motor_z/start_homing std_srvs/srv/Trigger {}
    ```

    </div>


    </div>

2. Set the current position. Usually this will be 0 but we can also specify arbitrary values either in motor dimensions (i.e. increments) or in physical dimensions ([m]).


    <div class="tabs">

    <div class="tab" data-label="x">

    ```console
    $ ros2 service call /gantry/motor_x/set_home_position gantry_msgs/srv/SetHomePosition {} 
    ```

    </div>

    <div class="tab" data-label="y">

    ```console
    $ ros2 service call /gantry/motor_y/set_home_position gantry_msgs/srv/SetHomePosition {} 
    ```

    </div>

    <div class="tab" data-label="z">

    ```console
    $ ros2 service call /gantry/motor_z/set_home_position gantry_msgs/srv/SetHomePosition {} 
    ```

    </div>


    </div>

    <div class="adm adm-todo"><p class="adm-title">To do</p>

    Add an example for non zero values



    </div>



</div>


</div>

## Smooth Accelerations in Position Mode


<details><summary>Details</summary>

The maximum acceleration can be set via the `~/set_max_accel` service. If the maximum acceleration is higher than what the motor can acutally achieve (it has to move quite a bit of mass) it will overshoot the target position. For smoother accelerations we can reduce the acceleration to a smaller value.


To get the currently set value run


<div class="tabs">

<div class="tab" data-label="x">

```console
$ ros2 service call /gantry_motor_x/get_max_accel gantry_msgs/srv/GetFloatDrive {}
```

</div>

<div class="tab" data-label="y">

```console
$ ros2 service call /gantry_motor_y/get_max_accel gantry_msgs/srv/GetFloatDrive {}
```

</div>

<div class="tab" data-label="z">

```console
$ ros2 service call /gantry_motor_z/get_max_accel gantry_msgs/srv/GetFloatDrive {}
```

</div>


</div>

To set a new value run


<div class="tabs">

<div class="tab" data-label="x">

```console
$ ros2 service call /gantry_motor_x/set_max_accel gantry_msgs/srv/SetFloatDrive '{motorside_value: 500}'
```

</div>

<div class="tab" data-label="y">

```console
$ ros2 service call /gantry_motor_y/set_max_accel gantry_msgs/srv/SetFloatDrive '{motorside_value: 500}'
```

</div>

<div class="tab" data-label="z">

```console
$ ros2 service call /gantry_motor_z/set_max_accel gantry_msgs/srv/SetFloatDrive '{motorside_value: 500}'
```

</div>


</div>

<div class="adm adm-note"><p class="adm-title">Note</p>

We could also set the `driveside_value` in SI units instead of value in motor dimensions.



</div>


</details>

## Limit the Motor Velocity in Position Mode


<details><summary>Details</summary>

This is equivalent to acceleration limit settings, but the service names are


- `~/get_max_speed`

- `~/set_max_speed`



</details>

## Run a Single Motor


<details><summary>Details</summary>

```console
$ ros2 run gantry single_motor --ros-args \
--params-file <path_to_config_file> \
-r __node:=<motor_name> \
-r __ns:=<namespace>
```

<div class="adm adm-note"><p class="adm-title">Note</p>

The path to the config file can be relative or absolute.



</div>

<div class="adm adm-attention"><p class="adm-title">Attention</p>

Keep in mind that namespaces have to start with a leading `/`. Setting the node name and the namespace is optional but recommended.




</div>

Example

Assuming we are inside the `gantry` package directory, we can directly run


```console
$ ros2 run gantry single_motor --ros-args \
--params-file config/motor_x.yaml \
-r __node:=single_x \
-r __ns:=gantry
```


</details>

## Run (and use) the GUI


On any computer with a graphical interface (i.e. **not** the Raspberry Pi via SSH), for example your laptop, run our GUI:


```console
$ ros2 run gantry_gui manual_control
```

A window should open:


![gantry gui screenshot](assets/setup/gantry_gui_screenshot.png)

<p class="figcaption">Gantry GUI for manual control.</p>

Remember to home the motors before using them.


Before you can use the manual control, you need to set a mode:


![gantry mode selection](assets/setup/gantry_mode_selection.png)

<p class="figcaption">Mode selection: manually control either distance travelled or velocity of motors.</p>

Then, you can use the arrows to control the individual axes.


Closing the GUI: `Ctrl` + `C` + you will need to manually close the window.


## Waypoint Grid Control


For measurements, you might want to position the gantry system at a certain set of waypoints. We have an example implementation for this within our [gantry ROS2 package](https://github.com/HippoCampusRobotics/gantry).


Run (preferably on your own laptop):


```console
$ ros2 launch gantry waypoint_grid_control_node.launch.py 
```

To start the waypoint controller, call the start service:


```console
$ ros2 service call /gantry/gantry_grid_control/start std_srvs/srv/Trigger
requester: making request: std_srvs.srv.Trigger_Request()
response:
std_srvs.srv.Trigger_Response(success=False, message='Starting...')
```

To stop:


```console
$ ros2 service call /gantry/gantry_grid_control/stop std_srvs/srv/Trigger
requester: making request: std_srvs.srv.Trigger_Request()
response:
std_srvs.srv.Trigger_Response(success=True, message='Stopping...')
```

<div class="adm adm-important"><p class="adm-title">Important</p>

The gantry GUI should not be running at the same time!



</div>

By default, the waypoints are defined within the file `gantry/config/waypoint_grid.yaml`. Adapt the waypoints by e.g. writing your own script.


On your own laptop, you can simply edit the default waypoint file. Alternatively, define the path to your waypoint file by using the `waypoint_file` launch argument.



## Restart Gantry System


1. The Raspberry Pi should be shutdown before the power gets removed. Run `sudo shutdown 0` on the pi and wait until its green LED is not blinking anymore.

2. Remove power from gantry system: Press any of the red emergency buttons.

3. To restart, *all* emergency buttons need to be enabled again. For this, they should all look like the button on the left:


    ![gantry emergency button not pressed](assets/setup/gantry_emergency_button_not_pressed.jpg)

    ![gantry emergency button pressed](assets/setup/gantry_emergency_button_pressed.jpg)

    Not pressed button *(left)* and pressed button *(right)*.


4. To turn on power again, press this button within the gantry power supply box:


    ![gantry power button](assets/setup/gantry_power_button.jpg)

    <p class="figcaption">Power button for gantry system.</p>

    When powered, the green LED should be on.


5. <div class="adm adm-important"><p class="adm-title">Important</p>

    You need to re-home the motors any time the power has been shut off. **This is crucial!**



    </div>


<div class="adm adm-note"><p class="adm-title">Note</p>

When the power is off, the x-axis and the y-axis can be moved by hand.



</div>


<p class="provenance">Migrated from the previous docs site: <a href="https://hippocampusrobotics.github.io/docs/contents/gantry/usage.html">contents/gantry/usage</a>.</p>
