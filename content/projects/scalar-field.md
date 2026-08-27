## What it is

Informative path planning over scalar fields — temperature-like quantities spread over the
tank. The vehicle maintains a belief about the field and plans where measuring next helps
most. This is the lab's active research line connecting estimation, planning, and a
physical benchmark.

## The pieces

- **`scalar_field_belief`** — a Gaussian-process belief over a 2D field: subscribe to
  measurements, fit a GP, publish mean and uncertainty.
- **`scalar_field_sim`** — simulated field measurements for development and evaluation.
- **`scalar_field_interfaces`** — the messages and services between them.
- **`path_planning`** and **`rapid_trajectories`** (+ msgs) — planning and fast trajectory
  generation the exploration builds on.
- **`ir_field_hardware`** and **`ir_adc_read`** — an infrared benchmark: a physical,
  repeatable scalar field over the tank, so exploration algorithms can be compared on
  real hardware.

## Where it stands

Active — the benchmark hardware repo saw commits within weeks of this page being written.
If you are starting research here, read `scalar_field_belief`'s README first; it is the
clearest entry point.
