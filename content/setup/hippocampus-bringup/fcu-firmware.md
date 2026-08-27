# FCU Firmware


## Building the Firmware


<div class="adm adm-todo"><p class="adm-title">To do</p>

Add instructions for different FCUs, especially PixHawk 6C



</div>

Assuming the PX4-Autopilot firmmware has been cloned and the build tools has been installed as described in [PX4 Setup](#/setup/getting-started/px4-setup), building the firmware for the PixRacer is done by


```console
$ make px4_fmu-v4_default
```

Since the FCU is connected with the Raspberry Pi via USB, it is possible to flash new firmwares directly from the Raspberry Pi.


In the PX4-Autopilot repository is a script to do this: `Tools/px_uploader.py`.


<div class="adm adm-hint"><p class="adm-title">Hint</p>

It is quite handy to have this script in `~/bin` on the Pi. Make sure that this directory is in `PATH`.



</div>

1. Copy the firmware you want to flash to the Raspberry Pi (for example with `scp`).

2. Reboot the FCU into bootloader mode via its shell (QGroundControl or debug port)


    ```sh
    screen /dev/fcu_debug 57600
    ```

    ```sh
    reboot -b
    ```

    The FCU should stop flashing slowly in green and start flashing rapidly in some weird color.


3. Flash the firmware


    ```sh
    px_uploader.py --port '/dev/ttyACM*' px4_fmu-v4_default.px4
    ```

    <div class="adm adm-attention"><p class="adm-title">Attention</p>

    Make sure you have single quotes around the port name. Otherwise the shell resolves the wildcard before the python script is executed. Alternatively choose the port directly, probably `/dev/fcu_usb`.



    </div>


## Exiting Bootloader


In some cases the FCU might get stuck in bootloader mode. In this case send the reboot sequence to the bootloader.


Run


```sh
python3
```

and execute the following lines:


```python
import serial
s = serial.Serial('/dev/fcu_usb', 115200)
s.write(b'\x30' + b'\x20')
quit()
```


<p class="provenance">Migrated from the previous docs site: <a href="https://hippocampusrobotics.github.io/docs/contents/hippocampus/fcu_firmware.html">contents/hippocampus/fcu_firmware</a>.</p>
