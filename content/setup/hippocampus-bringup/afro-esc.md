# Afro ESC


1. Download `AVRA`.


    ```console
    $ git clone https://github.com/Ro5bert/avra.git
    ```

2. Build and install `AVRA`


    ```console
    $ cd avra && sudo make install
    ```

3. Download the firmware


    ```console
    $ git clone https://github.com/hippocampusrobotics/tgy.git
    ```

4. Build the firmware. This depends on the interface used. The classic way to go is PWM. But if you want to control the ESCs directly from the Raspberry Pi, you might want to use I2C.


    <div class="tabs">

    <div class="tab" data-label="PWM">

    Modify at least the following lines in `tgy.asm`


    ```sh
    RC_PULS_REVERSE = 1 ; This enables forward/reverse throttle
    RC_CALIBRATION = 0 ; 
    STOP_RC_PULS = 1000 ; minimum pwm value
    FULL_RC_PULS = 2000 ; maximum pwm value
    ```

    **Optionally** fiddle with the deadband


    ```sh
    RCP_DEADBAND = 50 ; default value
    ```

    Build the firmware


    ```console
    $ make all
    ```


    </div>

    <div class="tab" data-label="I2C">

    Build the firmware in 8 different versions with different `MOTOR_ID` values starting from `0x29` and increasing by 1 per step.


    ```console
    $ make build_8
    ```


    </div>


    </div>

5. Connect the Afro Programmer with your computer and connect the data wires with the ESC. Supply the ESC with an appropriate voltage (probably ~10-12V).

6. Install or [download](https://hippocampusrobotics.github.io/docs/res/misc/avrdude) `avrdude`.


    <div class="adm adm-attention"><p class="adm-title">Attention</p>

    Newer versions of `avrdude` do not seem to work with the AFRO programmer. So you may want to stick with the older version in the download.



    </div>

7. Flash the `afro_nfet.hex` firmware you have built before.


    ```console
    $ avrdude -b 9600 -p m8 -P /dev/ttyUSB0 -c stk500v2 -e -U flash:w:afro_nfet.hex.0:i 
    ```

    <div class="adm adm-important"><p class="adm-title">Important</p>

    Make sure `avrdude` verifies the flashed data successfully. Otherwise rebuilt the firmware with `make clean && make all` and try again.



    </div>



<p class="provenance">Migrated from the previous docs site: <a href="https://hippocampusrobotics.github.io/docs/contents/hippocampus/afro_esc.html">contents/hippocampus/afro_esc</a>.</p>
