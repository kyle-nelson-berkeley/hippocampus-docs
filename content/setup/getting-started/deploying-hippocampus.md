# Deploying HippoCampus


## Start-Everyting-Check-List


1. **Push Buttons**


    ```console
    $ ssh pi@buttons-00.local
    ```

    Replace the vehicle name with the one of the vehicle we are actually using.


    ```console
    $ ros2 launch buttons button_1.launch.py vehicle_name:=uuv02
    ```

    We can detach the session with `F6`, since we do not have to interact with it anymore.


2. **Start the onboard nodes**


    ```console
    $ ssh pi@hippo-main-02.local
    ```

    ```console
    $ ros2 launch hardware hippo.launch.py vehicle_name:=uuv02
    ```

    Open a new terminal with `F2` more and start the debug session for the FCU.


    ```console
    $ screen /dev/fcu_debug 57600
    ```

    We use this session to either reboot the vehicle by entering `reboot` (it does not matter if there are messages popping up while entering this) or to reset the state estimtion by entering `ekf2 stop` and `ekf2 start`.


    We leave this session by hitting `Ctrl` + `A` followed by `k`. You have to confirm quitting the session by hitting `y`.



3. Launch the Qualisys MoCap-Bridge and replace the vehicle name so it matches our used vehicle.


    ```console
    $ ros2 launch qualisys_bridge qualisys_bridge.launch.py vehicle_name:=uuv02
    ```

    <div class="adm adm-note"><p class="adm-title">Note</p>

    Make sure to use the correct IP address of the computer running the Qualisys Tracking Manager in the config file inside the `qualisys_bridge` package. Check the address for the network interface, that connect the computer with the local network (not the one used to connect the cameras).



    </div>

4. Launch the specific setup we want to run, for example


    ```console
    $ ros2 launch hippo_common top_lemniscate_offboard.launch.py vehicle_name:=uuv02 use_sim_time:=false
    ```

    or


    ```console
    $ ros2 launch hippo_control top_motor_failure_intra_process.launch.py vehicle_name:=uuv02 use_sim_time:=false
    ```

    For this specific launch setup also run the following command to set the desired thrust to  non-zero value


    ```console
    $ ros2 topic pub -r 50 /uuv02/thrust_setpoint hippo_control_msgs/msg/ActuatorSetpoint 'x: 0.3'
    ```

5. Use the the green and red push button to arm/disarm the vehicle.


    <div class="adm adm-seealso"><p class="adm-title">See also</p>

    [Buttons](#/setup/guides/buttons)



    </div>


<div class="adm adm-attention"><p class="adm-title">Attention</p>

Always keep an eye on the battery level. There is a indicator light connected to the Raspberry Pi controlloing the buttons. Besides, the `esc_commander` node also publishes the battery voltage measured by the ESCs under `/uuv02/battery_voltage`. Make sure to **not** discharge the battery below 3.5V (it is okay to have short voltage drops under heavy load until 3.3V) per cell. Otherwise tell Lennart and/or Nathalie about it.



</div>

## Shutting-Down-Check-List


<div class="adm adm-note"><p class="adm-title">Note</p>

In general, please shutdown every Raspberry Pi with `sudo shutdown 0` before disconnecting any power supply.



</div>

1. Shutdown at least all battery powered Raspberry Pis (usually this means the one inside the vehicle) with `sudo shutdown 0` (make sure you run this command on the Pi and not on your own device by accident).

2. Disconnect all batteries and use the battery charger to charge the battery to storage voltage if you will not reuse it immediately.

3. If you have any batteries left that are not charged to storage voltage after your experiments are done, charge them to storage voltage. Do not store them at a voltage level above or below it.


## Final Steps


Look! It's running just perfectly fine without any trial and error.



![hippo inf path](https://res.cloudinary.com/dr76gues0/image/upload/v1788428847/hippocampus-docs/setup/hippo_inf_path.gif)


<p class="provenance">Migrated from the previous docs site: <a href="https://hippocampusrobotics.github.io/docs/contents/getting_started/deploying_hippocampus.html">contents/getting_started/deploying_hippocampus</a>.</p>
