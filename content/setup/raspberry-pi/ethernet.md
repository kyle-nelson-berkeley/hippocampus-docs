# Ethernet


## Pinout


We use the T-568B Pinout for all our ethernet connectors.


<div class="adm adm-attention"><p class="adm-title">Attention</p>

Sometimes the ethernet interface of the Raspberry Pi is lagging. We have not ultimately identified the cause, but the following steps might help with that.



</div>

<div class="adm adm-note"><p class="adm-title">Note</p>

The Bluerobotics Switch is a 100Mbit/s switch. So there is no need to configure the connection to be 100Mbit/s only, because it is 100Mbit/s anyway.




</div>

Most likely the Gigabit connection via our manually crimped RJ45 connectors is not stable. Hence, the connection speed (100 Mbit/s vs Gbit) is repetitively negotiated which results in an unstable connection.


We try to avoid this by manually setting the advertised link mode to 100 MBit/s.


```sh
$ETHTOOL --change eth0 advertise 0x008
```


<p class="provenance">Migrated from the previous docs site: <a href="https://hippocampusrobotics.github.io/docs/contents/raspberry_pi_setup/ethernet.html">contents/raspberry_pi_setup/ethernet</a>.</p>
