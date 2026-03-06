# API веб-интерфейса Bookimp (WebSocket) — v1

Документ описывает **публичный** API web-интерфейса Bookimp для **внешних клиентов** (мобильные приложения, десктоп-клиенты, интеграции).

> **Примечание по текущему релизу:** в этой сборке доступен **WebSocket API** (realtime + команды).  
> REST API в данную сборку **не входит**.

## Базовые URL

- Web UI (авто desktop/mobile): `GET /`
- Mobile UI (принудительно): `GET /m`
- WebSocket (realtime + команды): `WS /ws`

### Control endpoints (debug/admin)

- `POST /_control/reload` — отправляет всем браузер-клиентам событие `reload`.

## WebSocket API

### Подключение

- URL: `ws://<host>:<port>/ws` (или `wss://.../ws`)

### Формат сообщений

Команды клиент → сервер — JSON объект:

```json
{ "cmd": "CMD_PLAY", "data": {} }
```

- `cmd` (string, обязательно): имя команды, например `CMD_PLAY`
- `data` (object, опционально): payload команды; если отсутствует — считается `{}`

События сервер → клиент — JSON объект вида:

```json
{ "ev": "transport_state", "data": { ... } }
```

Где:
- `ev` (string): имя события
- `data` (object): payload события

> Сразу после подключения сервер отправляет несколько **initial snapshot** (playlists/transport/bookmarks), чтобы клиент мог отрисоваться без polling.

## События (server → client)

| Событие (`ev`) | Описание | Description (EN) |
|---|---|---|
| `playlists_snapshot` | Снапшот плейлистов/треков и активного плейлиста. | Snapshot of playlists + tracks and active playlist. |
| `transport_state` | Состояние транспорта (устройство, samplerate, усиления, mute, а также последние поля playback state). | Transport configuration/state (device, samplerate, gains, mute, and last playback state fields). |
| `transport_devices` | Список доступных аудиоустройств. | List of available audio devices. |
| `transport_progress` | Прогресс воспроизведения текущего трека. | Playback progress for the current track. |
| `transport_playback_state` | Изменение playback state. | Playback state change. |
| `waveform_started` | Начата генерация волны для трека. | Waveform generation started for a track. |
| `waveform_chunk` | Чанк волны (массивы mins/maxs). | Waveform peak chunk (mins/maxs arrays). |
| `waveform_done` | Генерация волны завершена. | Waveform generation finished. |
| `waveform_error` | Не фатальная ошибка волны. | Non-fatal waveform error. |
| `reload` | Попросить браузер перезагрузить страницу. | Ask browser clients to reload the page. |


### Схемы payload (высокоуровнево)

#### `playlists_snapshot`

```json
{
  "active_id": 1,
  "playlists": [
    {
      "id": 1,
      "name": "My Playlist",
      "tracks": [
        {
          "id": 10,
          "path": "/path/file.mp3",
          "title": "Title",
          "artist": "Artist",
          "album": "Album",
          "dur_ms": 123456,
          "sample_rate": 44100,
          "bitrate": 192000,
          "channels": 2,
          "file_size": 12345678,
          "ext": "mp3"
        }
      ]
    }
  ]
}
```

#### `transport_state` (частично)

```json
{
  "device_index": 0,
  "samplerate": 44100,
  "resample": 0,
  "gain_a": 0.0,
  "gain_b": 0.0,
  "mute_a": 0,
  "mute_b": 0,
  "decode_channels": 2,

  "play_pid": 1,
  "play_tid": 10,
  "play_path": "/path/file.mp3",
  "play_state": 1,
  "play_pos": 0.25,
  "play_dur_ms": 123456
}
```

#### `transport_progress`

```json
{ "pos_norm": 0.25, "duration_ms": 123456 }
```

- `pos_norm` — нормализованная позиция `0..1`

#### `transport_playback_state`

Обновления (зеркалирует транспортное событие `TRE_PLAYBACK_STATE_CHANGED`):

```json
{ "pid": 1, "tid": 10, "path": "...", "state": 1, "pos": 0.25, "dur_ms": 123456 }
```

#### События волны (waveform)

- `waveform_started`: `{ "wave_id": "...", "points": 2048, "duration_ms": 123456 }`
- `waveform_chunk`: `{ "wave_id": "...", "start": 0, "mins": [...], "maxs": [...] }`
- `waveform_done`: `{ "wave_id": "...", "points": 2048, "duration_ms": 123456, "has_chunks": true }`
- `waveform_error`: `{ "message": "..." }`

## Команды (client → server)

### Команды, доступные через Web API

| Команда (`cmd`) | Назначение | `data` payload |
|---|---|---|
| `CMD_AUDIO_DEVICES_RESCAN` | Пересканировать аудиоустройства. | `{}` |
| `CMD_AUDIO_DEVICE_SELECT` | Выбрать аудиоустройство по индексу. | `DEVICE_INDEX`: int |
| `CMD_AUDIO_SAMPLERATE` | Установить samplerate; 0 выключает ресемплинг. | `VALUE`: int Hz (or 0) |
| `CMD_BOOKMARK_CLEAR` | Очистить все закладки. | `{}` |
| `CMD_BOOKMARK_PLAY` | Воспроизвести закладку по id. | `ID`: int bookmark id |
| `CMD_BOOKMARK_REMOVE` | Удалить закладку по id. | `ID`: int bookmark id |
| `CMD_MUTE_A` | Переключить mute для каналов A. | `{}` |
| `CMD_MUTE_B` | Переключить mute для каналов B. | `{}` |
| `CMD_NEXT` | Следующий трек. | `{}` |
| `CMD_PAUSE` | Пауза/продолжить воспроизведение. | `{}` |
| `CMD_PLAY` | Начать воспроизведение. | `{}` |
| `CMD_PREV` | Предыдущий трек. | `{}` |
| `CMD_SEEK` | Перемотка по нормализованной позиции. | `VALUE`: float 0..1 |
| `CMD_SET_ACTIVE` | Сделать плейлист активным. | `PID`: int playlist id |
| `CMD_STOP` | Стоп. | `{}` |
| `CMD_TRACK_PLAY` | Воспроизвести конкретный трек из плейлиста. | `PIDS`: [int] playlist ids (first used)<br>`TIDS`: [int] track ids (first used) |
| `CMD_VOLUME_A` | Установить основную громкость (каналы A). | `VALUE`: int (typically 0..100) |
| `CMD_VOLUME_B` | Установить вторичную громкость (каналы B). | `VALUE`: int (typically 0..200) |


### Примечания по ключевым payload

- `CMD_SEEK`:
  - `data.VALUE` — **нормализованная** позиция `0..1` (не секунды)
- Громкость (`CMD_VOLUME_A`, `CMD_VOLUME_B`):
  - целочисленная шкала транспорта

## Полный каталог команд (по всему плееру)

В плеере определено больше команд, чем экспортируется через Web API в текущем релизе.  
Внешним разработчикам следует считать неэкспортируемые команды **неподдерживаемыми** в этой версии.

| Команда | Статус в Web API |
|---|---|
| `CMD_ADD_FILES` | — Не доступна через Web API |
| `CMD_ADD_FOLDER` | — Не доступна через Web API |
| `CMD_ADD_URL` | — Не доступна через Web API |
| `CMD_AUDIO_DEVICES_RESCAN` | ✅ Доступна (WS) |
| `CMD_AUDIO_DEVICE_SELECT` | ✅ Доступна (WS) |
| `CMD_AUDIO_SAMPLERATE` | ✅ Доступна (WS) |
| `CMD_BOOKMARK_CLEAR` | ✅ Доступна (WS) |
| `CMD_BOOKMARK_PLAY` | ✅ Доступна (WS) |
| `CMD_BOOKMARK_REMOVE` | ✅ Доступна (WS) |
| `CMD_BOOK_ADD_TO_CURRENT` | — Не доступна через Web API |
| `CMD_BOOK_ADD_TO_NEW` | — Не доступна через Web API |
| `CMD_BOOK_DOWNLOAD_ADD_TO_NEW` | — Не доступна через Web API |
| `CMD_BOOK_DOWNLOAD_CANCEL` | — Не доступна через Web API |
| `CMD_CLEAR` | — Не доступна через Web API |
| `CMD_CLEAR_ALL` | — Не доступна через Web API |
| `CMD_CLOSE` | — Не доступна через Web API |
| `CMD_CLOSE_TABS_RIGHT` | — Не доступна через Web API |
| `CMD_DROP` | — Не доступна через Web API |
| `CMD_EXIT` | — Не доступна через Web API |
| `CMD_EXPORT` | — Не доступна через Web API |
| `CMD_IMPORT` | — Не доступна через Web API |
| `CMD_MAIN_MUTE_A` | — Не доступна через Web API |
| `CMD_MAIN_MUTE_B` | — Не доступна через Web API |
| `CMD_MAIN_VOLUME_A` | — Не доступна через Web API |
| `CMD_MAIN_VOLUME_B` | — Не доступна через Web API |
| `CMD_MINI_MUTE_A` | — Не доступна через Web API |
| `CMD_MINI_MUTE_B` | — Не доступна через Web API |
| `CMD_MINI_VOLUME_A` | — Не доступна через Web API |
| `CMD_MINI_VOLUME_B` | — Не доступна через Web API |
| `CMD_MUTE_A` | ✅ Доступна (WS) |
| `CMD_MUTE_B` | ✅ Доступна (WS) |
| `CMD_NEW` | — Не доступна через Web API |
| `CMD_NEXT` | ✅ Доступна (WS) |
| `CMD_NONE` | — Не доступна через Web API |
| `CMD_OPEN` | — Не доступна через Web API |
| `CMD_PAUSE` | ✅ Доступна (WS) |
| `CMD_PLAY` | ✅ Доступна (WS) |
| `CMD_PLAY_BOOKMARK` | — Не доступна через Web API |
| `CMD_PLAY_ORDER_SEQ` | — Не доступна через Web API |
| `CMD_PLAY_ORDER_SHUFFLE` | — Не доступна через Web API |
| `CMD_PLAY_ORDER_TOGGLE` | — Не доступна через Web API |
| `CMD_POLICY_END_NEXT` | — Не доступна через Web API |
| `CMD_POLICY_END_REPEAT` | — Не доступна через Web API |
| `CMD_POLICY_END_STOP` | — Не доступна через Web API |
| `CMD_POLICY_REPEAT_TRACK` | — Не доступна через Web API |
| `CMD_PREV` | ✅ Доступна (WS) |
| `CMD_REMOVE` | — Не доступна через Web API |
| `CMD_RENAME` | — Не доступна через Web API |
| `CMD_REQ_BOOK_COVER` | — Не доступна через Web API |
| `CMD_RESCAN_ALL_TAG_METADATA` | — Не доступна через Web API |
| `CMD_SAVE` | — Не доступна через Web API |
| `CMD_SEARCH` | — Не доступна через Web API |
| `CMD_SEEK` | ✅ Доступна (WS) |
| `CMD_SET_ACTIVE` | ✅ Доступна (WS) |
| `CMD_SHOW_MAIN_WINDOW` | — Не доступна через Web API |
| `CMD_SHOW_MINI_PLAYER` | — Не доступна через Web API |
| `CMD_SHOW_WEB_UI` | — Не доступна через Web API |
| `CMD_SORT_ARTIST` | — Не доступна через Web API |
| `CMD_SORT_FOLDER_AND_NAME` | — Не доступна через Web API |
| `CMD_SORT_MANUAL` | — Не доступна через Web API |
| `CMD_SORT_NAME` | — Не доступна через Web API |
| `CMD_SORT_TITLE` | — Не доступна через Web API |
| `CMD_SORT_TRACK_NUM` | — Не доступна через Web API |
| `CMD_STOP` | ✅ Доступна (WS) |
| `CMD_TRACKS_CLEAR` | — Не доступна через Web API |
| `CMD_TRACKS_MOVE` | — Не доступна через Web API |
| `CMD_TRACKS_REMOVE_SELECTED` | — Не доступна через Web API |
| `CMD_TRACKS_REMOVE_UNSELECTED` | — Не доступна через Web API |
| `CMD_TRACK_ADD_BOOKMARK` | — Не доступна через Web API |
| `CMD_TRACK_OPEN_FOLDER` | — Не доступна через Web API |
| `CMD_TRACK_PLAY` | ✅ Доступна (WS) |
| `CMD_VOLUME_A` | ✅ Доступна (WS) |
| `CMD_VOLUME_B` | ✅ Доступна (WS) |
| `CMD_VST_ADD_FROM_DIALOG` | — Не доступна через Web API |
| `CMD_VST_ADD_PLUGIN` | — Не доступна через Web API |
| `CMD_VST_APPLY_PRESET` | — Не доступна через Web API |
| `CMD_VST_CLOSE_EDITOR` | — Не доступна через Web API |
| `CMD_VST_DELETE_PRESET` | — Не доступна через Web API |
| `CMD_VST_EDIT_SCAN_PATHS` | — Не доступна через Web API |
| `CMD_VST_LIST_PRESETS` | — Не доступна через Web API |
| `CMD_VST_MOVE_DOWN` | — Не доступна через Web API |
| `CMD_VST_MOVE_UP` | — Не доступна через Web API |
| `CMD_VST_OPEN_EDITOR` | — Не доступна через Web API |
| `CMD_VST_QUERY_EDITOR_RECT` | — Не доступна через Web API |
| `CMD_VST_REMOVE_SELECTED` | — Не доступна через Web API |
| `CMD_VST_REQUEST_STATE` | — Не доступна через Web API |
| `CMD_VST_RESCAN` | — Не доступна через Web API |
| `CMD_VST_SAVE_PRESET` | — Не доступна через Web API |
| `CMD_WAVEFORM_CACHE_CLEAR` | — Не доступна через Web API |
| `CMD_WAVEFORM_CACHE_SIZE` | — Не доступна через Web API |
| `CMD_WAVEFORM_CHUNK_SIZE` | — Не доступна через Web API |
| `CMD_WAVEFORM_WAVE_SIZE` | — Не доступна через Web API |


## Одновременная работа нескольких клиентов

Допускается одновременное подключение Web UI и внешнего клиента.  
Команды применяются сразу; при конфликте команд поведение фактически **last-write-wins**.

---
*Релиз 1.0 2026-03-05*
