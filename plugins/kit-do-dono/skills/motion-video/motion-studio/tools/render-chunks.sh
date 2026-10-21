#!/bin/bash
# Atalho antigo: o render em lotes agora é um só (tools/render_chunks.sh: vigia disco + RAM, retoma de onde parou).
exec bash "$(dirname "$0")/render_chunks.sh" "$@"
