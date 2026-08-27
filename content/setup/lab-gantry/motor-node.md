# Motor Node


The movement of the motor can either be controlled in position or in velocity mode. If used in position mode, the positon can be set as absolute value or as relative change of the current position target.


<div class="adm adm-attention"><p class="adm-title">Attention</p>

The relative position target changes the previous position target and is **not** based on the current motor position. Thus, a rapid succession of relative position setpoints might move the position setpoint quickly outside the safe range.



</div>

## Publishers


`~/position` **************


Type

[gantry_msgs/msg/MotorPosition](https://github.com/HippoCampusRobotics/gantry_msgs/tree/main/msg)


Description

Current motor position in increments of the motion controller's position encoder. The position is also converted to physical units [m] based on the conversion factor in the configuration.


`~/velocity` **************


Type

[gantry_msgs/msg/MotorVelocity](https://github.com/HippoCampusRobotics/gantry_msgs/tree/main/msg)


Description

Current motor velocity in RPM of the motor. The translational velocity of the respective gantry axis depends on the gear ratio. The conversion is performed based on the factor specified in the configuration file.


<div class="adm adm-note"><p class="adm-title">Note</p>

The velocity is computed as difference quotient of the motor position.



</div>

`~/motor_status` ******************


Type

[gantry_msgs/msg/MotorStatus](https://github.com/HippoCampusRobotics/gantry_msgs/tree/main/msg)


Description

Contains several motor status values, such as if the motor is currently homing, if the target position is reached, or the status of the limit switches. See the message definition for details.


## Subscriptions


`~/setpoint/absolute_position` ********************************


Type

[gantry_msgs/msg/MotorPosition](https://github.com/HippoCampusRobotics/gantry_msgs/tree/main/msg)


Description

Absolute position target. Can be set either in motor increments or in physical units [m].


`~/setpoint/relative_position` ********************************


Type

[gantry_msgs/msg/MotorPosition](https://github.com/HippoCampusRobotics/gantry_msgs/tree/main/msg)


Description

Relative position change. Can be set either in motor increments or in physical units [m].


`~/setpoint/velocity` ***********************


Type

[gantry_msgs/msg/MotorVelocity](https://github.com/HippoCampusRobotics/gantry_msgs/tree/main/msg)


Description

Velocity target for velocity control.


<p class="provenance">Migrated from the previous docs site: <a href="https://hippocampusrobotics.github.io/docs/contents/gantry/motor_node.html">contents/gantry/motor_node</a>.</p>
