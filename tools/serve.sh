#!/bin/bash
# Local preview — THE documented serve command.
# GitHub Pages serves the same files byte-identical; nothing to build.
cd "$(dirname "$0")/.." && exec python3 -m http.server "${1:-8130}"
