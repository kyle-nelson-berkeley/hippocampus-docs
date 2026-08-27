# Contributing to HippoCampus


## Creating new Packages


<div class="adm adm-note"><p class="adm-title">Note</p>

This requires write permissions for the HippoCampus project. Hence, the instructions are only applicable for maintainers/owners of HippoCampus



</div>

As a good starting point copy the following files from `hippo_common`.


- `.pre-commit-config.yaml`

- `.clang-format`

- `.gitignore`

- `pyproject.toml`


This is easily done if the `hippo_common` package exists in your workspace and your current working directory is inside your newly created package.


```console
$ cp ../hippo_common{.gitignore,.clang-format,.pre-commit-config.yaml, pyproject.toml} ./
```

## Working on Existing Packages



The following instructions are given exemplary for the `hippo_common` package and are applicable for other repositories/packages as well.


### Forking the Repository


<div class="adm adm-note"><p class="adm-title">Note</p>

This step requires you to have a GitHub account.



</div>

Go to repository's GitHub website: [https://github.com/hippoCampusRobotics/hippo_common](https://github.com/hippoCampusRobotics/hippo_common) and hit the **Fork** button and select your account's personal repositories as location to create the fork.


### Clone the Repository into the Workspace


Clone your own fork of the repository into your workspace and replace `<YOUR_USERNAME>` with your actual GitHub username.


```console
$ git clone git@github.com:<YOUR_USERNAME>/hippo_common
```

### Install the `pre-commit` Hooks


Make sure you are inside the repository.


```console
$ pre-commit install
```

<div class="adm adm-note"><p class="adm-title">Note</p>

If you do not have `pre-commit` installed, you can do so with


```console
$ sudo apt install pre-commit
```


</div>

These hooks ensure that proper formatting rules defined in the repository's `.clang-format` and `pyproject.toml` are applied. Typically we have `ruff` configured as Python formatter and `clang-format` as Cpp formatter. The hooks are run automatically for each commit and will abort the commit if the checks fail. The proper formatting is applied as unstaged change to the respective files. To 'accept' these changes, you have to stage them via `git add <FILE>`. After that you can retry the commit.


<div class="adm adm-note"><p class="adm-title">Note</p>

The hook only checks the formatting for the changes made since the last commit. If you want to check all files for proper formatting you can do so by running


```console
$ pre-commit run --all-files
trim trailing whitespace.................................................Passed
ruff.....................................................................Passed
ruff-format..............................................................Passed
clang-format.............................................................Passed
```


</div>

<div class="adm adm-hint"><p class="adm-title">Hint</p>

If you have a good reason to skip the checks and really have to create a commit without passing the checks, you can skip the pre-commit hooks by adding `--no-verify` as option for the `git commit` command.


```console
$ git commit --no-verify -m 'There is hopefully a proper reason to skip the pre-commit hooks in this commit!'
```


</div>

### Create a Pull Request


After you have done all the changes you wanted and pushed your commits to your own fork, you can create a Pull Request on [github.com](https://github.com) to


<p class="provenance">Migrated from the previous docs site: <a href="https://hippocampusrobotics.github.io/docs/contents/contributing/contributing_to_hippocampus.html">contents/contributing/contributing_to_hippocampus</a>.</p>
