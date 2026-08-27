# Ubuntu 24.04 Server 64bit



## Modify Cloud-Init


Modify `user-data` on the `system-boot` partition to your liking. An example configuration is provided below:


```yaml
#cloud-config

hostname: hippo-main-04
manage_etc_hosts: true
locale: en_US.UTF-8
timezone: Europe/Berlin

users:
    - name: pi
      groups: sudo, dialout, video
      sudo: "ALL=(ALL) NOPASSWD:ALL"
      # false -> allow password login
      lock_passwd: false
      shell: /bin/bash
      plain_text_passwd: "hippocampus"
      ssh_authorized_keys:
      - ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIF0xs6V9Lp2xzh/+hs+S919KpwAj9VHWO5NeHEuTYTpQ thies.lennart.alff@tuhh.de
      - ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDXZYQ3V6tmAQ7RhfCkmy9406FmKKgAVF0qDkeDJ7XroyYC10kLyEOWXFMbemqrQU3SHJ2ly0ujizZuJLtEYY60dWBCzIG1jHenPX7az0Vf/0Mj5m7lyttt/81RblfLzIDrFlFmdY/GI7fBB9IaMiFNQfTEV2IP7SsGQrrB8Ki7FkoHKZvV9iVn7+taO+g/MLs17JTtZICkTGZpzgxJfQepZMNt2/D5G7eo5YeTUnGT5SxidTxkhjcVqepdriDfy1lBZ7j/bD4tXh17024Pj/GI3gAO+CU67/mAvujaoDm2/LmiRkNvPYsSF1wyDVhfAu+Wdk/g/pbOAuas6boiQvPAM64I7cdjr2yOsmEJoADfaO2fxQHCwR7eW+gz2vY35XDdaAHfxGqTlLAvmS2rMjvKRPbC6chCyfozoBVQq2jZ/vq3IqqzLDt8Mb7LyiLm0ohxnD6o/8AbAOPL1un2mFm3kVYfIKuP00YrcBb4lDUDdE1YoxFlEeqGiTxsUIoiW0hyWmVRQa6aHpZte8AMoPev2JKk/WRLzcj5Pyf7/UG4zO7XrSb6baZ+r+Kqq0oHoE9zCG8On44vO751IWxmLeCXxliDbORhS12Ke+kMDzUz1gz+4wi38uJCcAKqzTSeNuchGmvTdoRGCNHGcqjFSGNfDVDdwOi+1+59fCTIgN9Ldw== lennartalff-yubikey
      - ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAID1jzFjfirr762nLh2CAwCoyrjfIezMH4it5nd4by+Bn nathalie_bauschmann@hotmail.de

# allow password ssh login
ssh_pwauth: true

package_update: true
package_upgrade: true
packages:
    - avahi-daemon

power_state: 
    mode: reboot
    delay: now
    condition: True
```

<div class="adm adm-note"><p class="adm-title">Note</p>

Make sure to connect the Raspberry Pi with the Internet via Ethernet before booting the first time.



</div>

## Boot Config

On the `system-boot` partition of the SD Card prepared for the Pi, edit `config.txt` and append the required lines for the specific setup.


<div class="adm adm-note"><p class="adm-title">Note</p>

This can also be done from the live system later on. The path to the file is then `/boot/firmware/config.txt`



</div>

See [the documentation](https://github.com/raspberrypi/firmware/blob/master/boot/overlays/README) for details on device tree overlays.


### I2C


```ini
dtoverlay=i2c4,pins_6_7
```

### UART


```ini
dtoverlay=uart2
dtoverlay=uart3
dtoverlay=uart4
dtoverlay=uart5
```

## Disable Interactive Upgrade


Edit `needrestart.conf` so it contains the following entries (uncomment and modify as required)


```conf
$nrconf{restart} = 'a';
$nrconf{kernelhints} = 0
```

## Create Workspace


```console
$ mkdir -p ~/ros2/src \
&& mkdir -p ~/ros2_underlay/src
```

### Concept











<p class="provenance">Migrated from the previous docs site: <a href="https://hippocampusrobotics.github.io/docs/contents/raspberry_pi_setup/ubuntu_24.04_server_64bit.html">contents/raspberry_pi_setup/ubuntu_24.04_server_64bit</a>.</p>
