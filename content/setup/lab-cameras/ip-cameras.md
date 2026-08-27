# IP Cameras (Blick)


<div class="adm adm-note"><p class="adm-title">Note</p>

At the time of writing the IP addresses of the cameras are `192.168.0.116` and `192.168.0.148`. This might change in the future.



</div>

<div class="tabs">

<div class="tab" data-label="Camera 1">

```sh
IP_CAMERA_ADDRESS="192.168.0.116"
```

</div>

<div class="tab" data-label="Camera 2">

```sh
IP_CAMERA_ADDRESS="192.168.0.148"
```

</div>


</div>

## Streaming


<div class="tabs">

<div class="tab" data-label="No Latency">

```sh
gst-launch-1.0 rtspsrc location=rtsp://${IP_CAMERA_ADDRESS}:554/11 latency=0 buffer-mode=auto ! queue ! rtph265depay ! h265parse ! decodebin ! videoconvert ! autovideosink
```

</div>

<div class="tab" data-label="Stable">

```sh
gst-launch-1.0 rtspsrc location=rtsp://${IP_CAMERA_ADDRESS}:554/11 buffer-mode=auto ! queue ! rtph265depay ! h265parse ! decodebin ! videoconvert ! autovideosink
```

</div>


</div>

## Save to File


```console
$ gst-launch-1.0 rtspsrc location=rtsp://${IP_CAMERA_ADDRESS}:554/11 buffer-mode=auto ! queue ! rtph265depay ! h265parse ! mp4mux ! filesink location=test.mp4 -e
```


<p class="provenance">Migrated from the previous docs site: <a href="https://hippocampusrobotics.github.io/docs/contents/cameras/ip_cameras.html">contents/cameras/ip_cameras</a>.</p>
