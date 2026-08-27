# DVL


For this section it is assumed, that the environment variable `VEHICLE_NAME` is set (for example in `.zshrc` or directly inside the terminal).


```console
$ export VEHICLE_NAME=bluerov01
```

## Related ROS packages


- [dvl](https://github.com/HippoCampusRobotics/dvl)

- [dvl_msgs](https://github.com/HippoCampusRobotics/dvl)


## General Information


The acoustic transducer of the DVL will be disabled when the dvl interface node is started. This way, the risk of the DVL overheating while the vehicle is not submerged is reduced. Most likely it will overheat anyway if outside the water. The DVL will be shutdown and needs to cool down before it restarts again.


Call the corresponding service to enable the acoustic transducer of the DVL


```console
$ ros2 service call /${VEHICLE_NAME}/dvl/set_acoustic_enabled dvl_msgs/srv/SetAcousticEnabled 'acoustic_enabled: true'

waiting for service to become available...
requester: making request: dvl_msgs.srv.SetAcousticEnabled_Request(acoustic_enabled=True)

response:
dvl_msgs.srv.SetAcousticEnabled_Response(success=True, message='')
```

In case it is necessary, the speed of sound for the DVL's internal computations can be set via


```console
$ ros2 service call /${VEHICLE_NAME}/dvl/set_speed_of_sound dvl_msgs/srv/SetSpeedOfSound 'speed_of_sound: 1475.0'
```

The current config can be request by


```console
$ ros2 service call /${VEHICLE_NAME}/dvl/get_config dvl_msgs/srv/GetConfig {}                                          
waiting for service to become available...
requester: making request: dvl_msgs.srv.GetConfig_Request()

response:
dvl_msgs.srv.GetConfig_Response(success=True, message='', result=dvl_msgs.msg.ConfigResult(speed_of_sound=1475.0, acoustic_enabled=False, dark_mode_enabled=False, mounting_rotation_offset=0.0, range_mode='auto', periodic_cyling_enabled=False))
```

Reset the dead reckoning:


```console
$  ros2 service call /${VEHICLE_NAME}/dvl/reset_dead_reckoning dvl_msgs/srv/ResetDeadReckoning {}
requester: making request: dvl_msgs.srv.ResetDeadReckoning_Request()

response:
dvl_msgs.srv.ResetDeadReckoning_Response(success=True, message='')
```

<div class="adm adm-attention"><p class="adm-title">Attention</p>

The dead reckoning will quickly diverge if no valid velocity measurement from the acoustic transducer is available. Keep this in mind if relying on the dead reckoning data for state estimation. Due to sudden jumps in the dead reckoning position it is probably a bad idea to directly control the vehicle based on this data and resetting the dead reckoning in the meantime.




</div>

The DVL can be accessed via the web browser at [http://waterlinked-dvl.local/](http://waterlinked-dvl.local/).




<p class="provenance">Migrated from the previous docs site: <a href="https://hippocampusrobotics.github.io/docs/contents/bluerov/dvl.html">contents/bluerov/dvl</a>.</p>
