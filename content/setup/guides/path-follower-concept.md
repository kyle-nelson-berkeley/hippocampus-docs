# Concept


The `path_planning` package provides a simple `path_follower` node. It loads a pre-defined path from a `yaml` file and choses the current target point based on the vehicle's current position and the configured look ahead distance.


It publishes a desired heading as normalized 3d vector that points in the directino of the target location. To be useful it is typically complemented by an attitude controller (at least for the HippoCampus, the BlueROV could move in any direction with an arbitrary attitude) from the `hippo_control` package.


A default configuration is stored in the package's `path_follower_default.yaml` file. It is not recommended to edit this file, but to create a copy and use the copied file as new configuration.


This can be done with the following command


```console
$ cp "$(ros2 pkg prefix --share path_planning)/config/path_follower_default.yaml" ~/my_path_follower_config.yaml
```

which creates a copy of the package's default configuration inside the home directory with the name `my_path_follower_config.yaml`


```console
~/
├── ...
├── my_path_follower_config.yaml
└── ...
```

<div class="adm adm-hint"><p class="adm-title">Hint</p>

This works for both cases, a package installation from source and a package installation from the precompiled binaries. Lucky us 🥳.



</div>

## Launch Parameters


Since the typical path follower setup requires a control setup to actually follow the path, there is a convenience launch file inside `hippo_control`.


To list the configuration options, we can run the launch file with the `-s` option.


```console
$ ros2 launch hippo_control top_path_following_intra_process.launch.py -s                      
Arguments (pass arguments as '<name>:=<value>'):

    'vehicle_name':
        Vehicle name used as namespace.

    'use_sim_time':
        Decides wether to use the wall time or the clock topic as time reference. Set to TRUE for simulation.

    'attitude_control_config':
        no description given
        (default: '/home/ros-user/uuv/ros2/install/hippo_control/share/hippo_control/config/attitude_control/geometric_hippocampus_default.yaml')

    'path_follower_config':
        no description given
        (default: '/home/ros-user/uuv/ros2/install/path_planning/share/path_planning/config/path_follower_default.yaml')
```

## Launch with Custom Configuration File


To run the path follower setup with our previously created custom configuration, we execute


```console
$ ros2 launch hippo_control top_path_following_intra_process.launch.py vehicle_name:=uuv02 use_sim_time:=false path_follower_config:="$HOME/my_path_follower_config.yaml"
```

<div class="adm adm-hint"><p class="adm-title">Hint</p>

Relative paths for config files work as well. If you really dislike prepending `$HOME` you could omit it, if you launch from inside the home directory. But this leaves room for errors in case you run the same command inside another terminal which is currently in another directory. Hence, we **recommend** to use **absolute paths**.



</div>

## Use one of the Predefined Paths


There are some path files inside the package's config directory. We can list them via


```console
$ ls "$(ros2 pkg prefix --share path_planning)/config" 
bernoulli_default.yaml  bernoulli_small.yaml  circles.yaml  motor_failure_surface.yaml  path_follower_default.yaml
```

and if we want to get the file path for `circles.yaml`


we can run


```console
$ echo "$(ros2 pkg prefix --share path_planning)/config/circles.yaml"
/home/ros-user/uuv/ros2/install/path_planning/share/path_planning/config/circles.yaml
```

And copy-paste this into our custom path follower config file, i.e. `~/my_path_follower_config.yaml` for the `path_file` parameter.


Alternatively, we can repeat the steps for copying the config file for the path files as well. This way the path files are in a nicer location.


If, for example, we like to run a set of experiments with several `path_follower` configs and several path files, we probably want to have them all together inside a reasonably named subdirectory of our home directory.


<p class="provenance">Migrated from the previous docs site: <a href="https://hippocampusrobotics.github.io/docs/contents/path_follower/concept.html">contents/path_follower/concept</a>.</p>
