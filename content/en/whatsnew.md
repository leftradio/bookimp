## What's New (Version 1.0.2)

#### Complete rebuild of the playlist service:
- Support for large playlists (for 100k+ tracks: initial add time depends on disk speed and metadata volume; save/load time is ~1.5 sec)
- Asynchronous metadata reading: tracks appear in the playlist almost immediately, with no need to wait for the full load to complete
- Metadata reading for network sources
- Import/export of all playlists in a custom binary format
- Opening/saving playlists in `.m3u`, `.m3u8`, `.pls`, `.xspf`, and `.cue` formats
- Fast sorting/searching (100k+ tracks, ~0.8...1 sec)
- Playlist rendering migrated to a model/view architecture, minimizing memory usage on the display side
- Saving file addition paths for each playlist
- Automatic playlist naming based on metadata/names/parent folder (selected automatically), so no more "Playlist X"
- Expanded automatic cover art search

#### Optimization of the bookmarks service: less memory usage, higher speed (1k+ bookmarks)
- Added handling of invalid bookmarks when the playlist/track is missing

#### Complete rebuild of the audio engine (FFmpeg + PortAudio + VST2)
- Support for playback of an even wider range of formats
- Support for network sources (seeking only works for sources that allow it; for example, internet radio does not)
- Added a native signal measurement module, so no more external calculations
- Significant CPU load optimization for the entire playback process
- Added the ability to save presets for VST plugins
- The audio stream now runs without the GIL, with almost fully native C execution (Cython)
- All audio processes now run in 32-bit float
- Added resampling (with the option to disable it)

#### Added a web interface for controlling the player over the network
- Built-in client
- Support for external clients (WebSockets, API available [here](web-interface/web-api.ru.md))

#### Added tray mode
- Mini-player interface available
- Control from the tray context menu

#### Added a File Explorer context menu for folders/files
- Play (using the "default" playlist), add to the current/new playlist

#### Added the online SViD library
- Add any book to the current or a new playlist (as an online source)
- Ability to download a book and automatically add it to a playlist

#### Other minor changes
