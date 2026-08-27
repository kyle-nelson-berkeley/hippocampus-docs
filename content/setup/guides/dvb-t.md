# DVB-T Stick


NooElec R820T2 SDR & DVB-T NESDR Mini 2


## Firmware Installation


Requirements:


```console
$ sudo apt install build-essential cmake git \
&& sudo apt install libusb-dev libusb-1.0-0-dev
```

Clone rtl-sdr library and build:


<div class="tabs">

<div class="tab" data-label="ssh">

```console
$ git clone git@github.com:librtlsdr/librtlsdr.git && \
cd librtlsdr && \
mkdir build && \
cd build && \
cmake ../ -DINSTALL_UDEV_RULES=ON -DDETACH_KERNEL_DRIVER=ON && \
make && \
sudo make install && \
sudo ldconfig
```

</div>

<div class="tab" data-label="https">

```console
$ git clone https://github.com/librtlsdr/librtlsdr.git \
&& cd librtlsdr \
&& mkdir build \
&& cd build \
&& cmake ../ -DINSTALL_UDEV_RULES=ON -DDETACH_KERNEL_DRIVER=ON \
&& make \
&& sudo make install \
&& sudo ldconfig
```

</div>


</div>

Install python wrapper from source. Installation via pip does not work from Ubuntu 24.04 on and package is currently not available via apt:


<div class="tabs">

<div class="tab" data-label="ssh">

```console
$ cd \ 
&& git clone git@github.com:pyrtlsdr/pyrtlsdr.git \
&& cd pyrtlsdr \
&& sudo python3 setup.py install
```

</div>

<div class="tab" data-label="https">

```console
$ cd \ 
&& git clone https://github.com/pyrtlsdr/pyrtlsdr.git \
&& cd pyrtlsdr \
&& sudo python3 setup.py install
```

</div>


</div>

## Fix Access Error


If you try to use the DVB-T stick using pyrtlsdr, for example using


```console
$ ros2 launch sdr sdr.launch.py
```

You might get the following error message:


```sh
[sdr_node.py-1]     raise LibUSBError(result, 'Could not open SDR (device index = %d)' % (device_index))
[sdr_node.py-1] rtlsdr.rtlsdr.LibUSBError: <LIBUSB_ERROR_ACCESS (-3): Access denied (insufficient permissions)> "Could not open SDR (device index = 0)"
[ERROR] [sdr_node.py-1]: process has died [pid 59289, exit code 1, cmd '/home/nathalie/ros2/install/sdr/lib/sdr/sdr_node.py --ros-args'].
```

Blacklisting the `dvb_usb_rtl28xxu` module fixes this. Add the following to `etc/modprobe.d/blacklist.conf` (will need root access)


```sh
blacklist dvb_usb_rtl28xxu
blacklist rtl2832
blacklist rtl2830
```

You will need to reboot.


<p class="provenance">Migrated from the previous docs site: <a href="https://hippocampusrobotics.github.io/docs/contents/rf/dvb_t.html">contents/rf/dvb_t</a>.</p>
