# Acoustic Modems


## Time definitions


| Variable | Description |
|---|---|
| <span class="math">`T_{\text{p}}`</span> | Poll duration |
| <span class="math">`\tau_{\text{p}}`</span> | Propagation delay (travel time of poll) |
| <span class="math">`T_{\text{wp}}`</span> | Processing delay receiver (process poll, generate response and switch from receiving to transmission mode) |
| <span class="math">`T_{\text{r}}`</span> | Response duration |
| <span class="math">`T_\text{TWR}`</span> | Measured two-way-ranging time, with <span class="math">`T_\text{TWR} = t_\text{r} - t'_\text{p}`</span> |
| <span class="math">`\tau`</span> | Time of flight (TOF), with <span class="math">`\tau = \frac{T_\text{TWR} - T_\text{wp}}{2} = \frac{\tau_\text{p} + \tau_\text{r}}{2}`</span> |
| <span class="math">`T_\text{wr}`</span> | Processing delay agent |
| <span class="math">`\tau_\text{r}`</span> | Travel time of response |

**Broadcast algorithm**: Single broadcast poll packet from agent, which is received by all anchors. Responses are transmitted sequentially, implemented e.g. by using different <span class="math">`T_{\text{wp},i}`</span> for each anchor <span class="math">`i`</span>. Unique offset <span class="math">`T_{\text{wp},i}`</span> is called *ranging delay*.


**Alternating algorithm**: Send individual poll to each anchor





<p class="provenance">Migrated from the previous docs site: <a href="https://hippocampusrobotics.github.io/docs/contents/hardware/acoustic_modems.html">contents/hardware/acoustic_modems</a>.</p>
