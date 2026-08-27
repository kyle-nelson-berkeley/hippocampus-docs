# Motor Configuration


The following image depicts the thruster configuration. The numbers correspond to the FCU's PWM outputs. Make sure the propellers are mounted correctly since there are two clockwise and two counterclockwise propellers.


![thrusters](assets/setup/thrusters.png)

<p class="figcaption">Motor and propeller configuration.</p>

To avoid confusion, the order of the three motor/ESC wires should be black, red, yellow from front to rear. If the ESC or motor has other colors for its wires make sure the motor turns in positive direction (right hand rule with axis parallel to the vehicle's x-axis 😉) for positive setpoints.


To test this you can use the `motor_test` command in the FCU's shell (you can access the shell via the debug port or via QGroundControl's MAVLink Console). For details see the [PX4 documentation](https://dev.px4.io/master/en/middleware/modules_command.html#motortest).


<div class="adm adm-attention"><p class="adm-title">Attention</p>

Since we use the motors in reversible mode the parameter `-p 50` corresponds to a stopped motor. 0 corresponds to full throttle backward and 100 corresponds to full throttle forward.



</div>

To let the first motor turn for a second you can enter for example this:


```console
$ motor_test test -p 60 -m 1 -t 1
```


<p class="provenance">Migrated from the previous docs site: <a href="https://hippocampusrobotics.github.io/docs/contents/hippocampus/motor_configuration.html">contents/hippocampus/motor_configuration</a>.</p>
