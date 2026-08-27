# Install Source Dependencies


Some ROS packages might have dependencies that you have to install from source. For this case, the git repository URLs are written in a `.repos` file.


To clone all source dependencies of e.g. `hippo_full`:



```console
$ cd ~/ros2/src \ 
&& vcs import < hippo_full/hippo_full.repos
```

Note that the repositories will be cloned using `https`. If you need to push changes, you will need to manually switch to `ssh`.


<p class="provenance">Migrated from the previous docs site: <a href="https://hippocampusrobotics.github.io/docs/contents/misc/install_source_dependencies.html">contents/misc/install_source_dependencies</a>.</p>
