# Servo And Light


The LED headlights and the camera servo are controlled via PWM signals. To get a jitter-free PWM signal, a library, supporting hardware PWM, is required. For example `pigpio`.


## Install PIGPIO


### Raspbian


```console
$ sudo apt-get update && \
sudo apt-get install pigpio python-pigpio python3-pigpio
```

### Ubuntu


```console
$ wget https://github.com/joan2937/pigpio/archive/master.zip && \
unzip master.zip && \
cd pigpio-master && \
make && \
sudo make install
```

## Enable The Daemon


### Ubuntu only


You need to create the `pigpiod.service` file at `/etc/systemd/system`.


```ini
[Unit]
Description=Pigpio daemon

[Service]
Type=forking
PIDFile=pigpio.pid
ExecStart=/usr/local/bin/pigpiod

[Install]
WantedBy=multi-user.target
```

### Raspbian and Ubuntu


Enable the service


```console
$ sudo systemctl enable pigpiod.service
```

and run the service


```console
$ sudo systemctl start pigpiod.service
```


<p class="provenance">Migrated from the previous docs site: <a href="https://hippocampusrobotics.github.io/docs/contents/bluerov/servo_and_light.html">contents/bluerov/servo_and_light</a>.</p>
