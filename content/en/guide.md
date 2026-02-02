# Guide: Preparing an audiobook for separate Voice / Background volume control

## Format concept (“stems” in one file)

For the player to control volume separately, voice and background must be placed in different channels of the same multichannel audio file:

- Channels 1–2: Voice (narrator) — stereo pair (or mono duplicated to L/R)
- Channels 3–4: Background (music/ambience) — stereo pair

The player reads the file as 4-channel and independently controls the volume of the two channel pairs.

## DAW setup (universal logic)

- Narrator track(s) → dedicated bus/out 1–2
  If the voice is mono, keep the track mono, but route it to a stereo 1–2 output (center/dual-mono).
- Background/music track(s) → dedicated bus/out 3–4
- Do not sum narrator and background into 1–2 on the master bus, otherwise separate control is lost.

## Export (example: OGG)

Export a 4-channel interleaved file:

- Channels: 4 (interleaved)
- Order: Ch1/Ch2 = Voice L/R; Ch3/Ch4 = BGM L/R (as in the diagram)
- Sample rate / bit depth: follow your pipeline (the player supports 44.1/48/96/192 kHz; 16/24/32 float)

Note: some DAWs label 4-channel export as Quad. Different systems may use surround layouts, but in practice you just need 4 discrete channels in the correct order.

## So why OGG and not MP3?

> MP3 (MPEG-1 Layer III) is effectively designed for mono/stereo (up to 2 channels), so you can’t store 4 discrete channels “as is”.
MPEG-2 multichannel extensions existed, but native support is very poor and inconsistent across systems.

> Ogg Vorbis supports a wide range of configurations and up to 255 channels. Quality per size: at similar file sizes, Vorbis usually delivers better perceived quality than MP3. OGG is open and royalty-free: no patent/licensing restrictions (convenient for distribution).

## Possible mistakes

- Exporting “Stereo mixdown” instead of 4-channel interleaved
- Voice and background accidentally summed into 1–2 (separate volume control won’t work)
- Channel order swapped (can be fixed by testing each stem with short test signals)

<br>
<br>

Example Reaper project can be downloaded via the link below. It includes two tracks (VOICE and BACKGROUND) and OGG routing already set up.
