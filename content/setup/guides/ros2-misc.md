# Misc


## Build Command


Symlink builds are recommended, so symbolic links to `src` are used where possible.



```console
$ colcon build --symlink-install
```

In case `compile_commands.json` is needed for parsing/autocompletion


```console
$ colcon build --symlink-install --cmake-args -DCMAKE_EXPORT_COMPILE_COMMANDS=ON
```

<div class="adm adm-attention"><p class="adm-title">Attention</p>

If one likes to source the custom workspace in `.zshrc`, make sure you do **not** use this environment to build the workspace. Instead run the build command in — for example — `bash`, where you only source workspaces outside the workspace you want to build! To avoid inheriting environment variables you can run `env -i bash` or for a docker setup run


```console
$ docker exec -it ros2 bash
```


</div>

<div class="adm adm-hint"><p class="adm-title">Hint</p>

On a native Ubuntu installation, aliases for building the ROS workspaces are quite handy.


```sh
alias build_ros="env -i HOME=$HOME USER=$USER TERM=xterm-256color bash -l -c 'source $HOME/ros2_underlay/install/setup.bash && cd $HOME/ros2 && colcon build --symlink-install --cmake-args -DCMAKE_EXPORT_COMPILE_COMMANDS=ON'"
alias build_underlay="env -i HOME=$HOME USER=$USER TERM=xterm-256color bash -l -c 'source /opt/ros/iron/setup.bash && cd $HOME/ros2_underlay && colcon build'"
```

The development workspace and the underlay can be built from any directory with the commands `build_ros` and `build_underlay`, respectively.




</div>

## Installing Dependencies


```console
$ rosdep install --from-paths src -y --ignore-src
```

## Auto-Complete


<div class="adm adm-attention"><p class="adm-title">Attention</p>

ROS2 command line tools do not autocomplete as of this [GitHub Issue](https://github.com/ros2/ros2cli/issues/534). While this issue has since been closed, the problem still occurs. To fix it, add the following to `.zshrc`.



</div>

```text
eval "$(register-python-argcomplete3 ros2)"
eval "$(register-python-argcomplete3 colcon)"
```

<div class="adm adm-attention"><p class="adm-title">Attention</p>

Auto-completing topic names seems to work only after an execution of `ros2 topic list`. Before the auto-complete gets stuck and has to be canceled by `Ctrl` + `C`.



</div>

<div class="adm adm-note"><p class="adm-title">Note</p>

Sourcing `install/setup.zsh` might reset this. Better source `install/local_setup.zsh`.



</div>

## Verifying XACRO


```console
$ check_urdf <(xacro path/to/your/file.xacro)
```


<p class="provenance">Migrated from the previous docs site: <a href="https://hippocampusrobotics.github.io/docs/contents/ros2/misc.html">contents/ros2/misc</a>.</p>
