# Quality-of-Life Features


Similarly to the setup on your desktop computer, let's also install our preferred shell, byobu etc. on all Raspberry Pis.


This is identical to the quality-of-life-Features section in Getting Started.


```console
$ sudo apt install -y zsh git curl wget byobu vim\
&& sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

Choose `zsh` as default by hitting enter.


```console
$ mkdir -p "$HOME/.zsh" && \
git clone https://github.com/sindresorhus/pure.git "$HOME/.zsh/pure" && \
echo 'fpath+=$HOME/.zsh/pure \nautoload -U promptinit; promptinit \nprompt pure' | cat - ~/.zshrc > temp && mv temp ~/.zshrc && \
sed -i 's/ZSH_THEME="robbyrussell"/ZSH_THEME=""/' ~/.zshrc && \
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions && \
sed -i 's/plugins=(git)/plugins=(git zsh-autosuggestions)/' ~/.zshrc && \
echo "zstyle ':prompt:pure:path' color 075\nzstyle ':prompt:pure:prompt:success' color 214\nzstyle ':prompt:pure:user' color 119\nzstyle ':prompt:pure:host' color 119\nZSH_AUTOSUGGEST_HIGHLIGHT_STYLE='fg=161'" >> ~/.zshrc && \
echo "zstyle ':prompt:pure:path' color 075\nzstyle ':prompt:pure:prompt:success' color 214\nzstyle ':prompt:pure:user' color 119\nzstyle ':prompt:pure:host' color 119\nZSH_AUTOSUGGEST_HIGHLIGHT_STYLE='fg=161'" >> ~/.zshrc && \
echo "export TERM=xterm-256color" >> ~/.zshrc && \
source ~/.zshrc && \
byobu-enable
```


<p class="provenance">Migrated from the previous docs site: <a href="https://hippocampusrobotics.github.io/docs/contents/raspberry_pi_setup/quality_of_life_features.html">contents/raspberry_pi_setup/quality_of_life_features</a>.</p>
