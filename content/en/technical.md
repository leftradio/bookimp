## Technical specs

- Platform: Windows x64

- Audio formats (decoding): via `soundfile` / `libsndfile`
  - WAV, AIFF/AIFC, FLAC, OGG/Vorbis, AU, RAW, MAT (MATLAB), PAF, SVX, NIST, IRCAM, VOC, W64, RF64, etc.

- Sample rates / bit depth:
  - 44.1 / 48 / 96 / 192 kHz
  - 16-bit / 24-bit / 32-bit float

- Internal processing:
  - non-destructive processing
  - float pipeline

- Audio output:
  - Standard Windows audio outputs (WASAPI / DirectSound / MME)
  - ASIO
  - ASIO buffer/latency control — planned
  - Resampling — planned

- Audio processing (plugins): VST2
  - 32-bit
  - 64-bit (experimental)
  - effect chains supported; all plugin parameters are saved
  - chain import/export — planned

- Waveform:
  - waveform building with configurable parameters
  - caching for maximum speed on reopen and redraw

- UX features (for audiobooks):
  - bookmarks with position saving
  - tray control — planned

- Architecture:
  - modular architecture
  - message bus between modules (a platform for extensions)
