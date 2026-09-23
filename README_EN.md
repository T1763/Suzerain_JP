# Suzerain Japanese Patch (Unofficial)

[日本語](README.md)

An unofficial, fan-made Japanese translation for playing the political simulation game *Suzerain* in Japanese.

- **Site**: https://t1763.github.io/Suzerain_JP/ (Japanese)
- **Download the latest version**: https://github.com/T1763/Suzerain_JP/releases
- **Report a problem**: https://t1763.github.io/Suzerain_JP/report.html
- **Glossary (English ⇔ Japanese)**: https://t1763.github.io/Suzerain_JP/glossary.html

## What gets translated

- Dialogue and narration (the main game *Sordland* and the DLC *Kingdom of Rizia*)
- Reports, newspapers, journal entries, and bill and policy descriptions
- The Codex. Blue words in the text open their entries
- The launch screen, the main menu, and the in-game menus

No fonts or DLLs are added. The patch only replaces game files with Japanese versions.

## Requirements

- The Steam version of *Suzerain* for Windows, **3.1.0 (Windows) Build: 175** (the version shown in the game). Do not install it on a different version
- No extra software is needed. Nothing is executed — you only overwrite files, so Smart App Control does not block it either

## How to install

1. **Quit Suzerain.**
2. Download the latest ZIP from [Releases](https://github.com/T1763/Suzerain_JP/releases), then right-click it → **Extract All**.
3. In the Steam **Library**, right-click Suzerain → **Manage** → **Browse local files**. The game folder (the one containing `Suzerain_Data` and `Suzerain.exe`) opens.
4. Drag the **`Suzerain_Data` folder** from the extracted folder onto the game folder.
5. When **Replace or Skip Files** appears, choose **Replace the files in the destination** (7 files). If Windows says administrator permission is required, click **Continue**.
6. Start the game. If the main menu is in Japanese (e.g. 「物語を始める」 for *Start Story*), you are done.

## Going back to English

The package does not contain the original English files. Instead, let Steam check the game files and restore them.

1. Quit Suzerain.
2. In the Steam **Library**, right-click Suzerain and open **Properties**.
3. Select **Installed Files** on the left and click **Verify integrity of game files**.
4. When the check finishes, Steam downloads the replaced files again (about 100 MB) and the game is back in English.

To switch back to Japanese, overwrite the files again by following "How to install".

## Troubleshooting

| Symptom | What to do |
|---|---|
| No **Replace** dialog appeared and files were only added | You dropped the folder in the wrong place. Drag the `Suzerain_Data` folder to where `Suzerain.exe` is. If unsure, go back to English first and try again. |
| The game does not start or the screen looks wrong | The game version may not match. Go back to English with the steps above and check the matching version on the [site](https://t1763.github.io/Suzerain_JP/). |
| Only some parts are in English | Check that all 7 files were replaced, then overwrite them again. |

## FAQ

### Will my save data be deleted?

No. The patch only changes the game's text data.

### What happens when the game is updated?

A Steam update may switch the game back to English. **Do not overwrite an updated game with an old version of the patch** (if the versions do not match, the game may not work correctly). Please wait for a new version matching the update on the [site](https://t1763.github.io/Suzerain_JP/).

### I found a translation problem

Send it with a screenshot from [Report a problem](https://t1763.github.io/Suzerain_JP/report.html). No GitHub account is needed.

### I want to check how proper nouns are translated

The [glossary](https://t1763.github.io/Suzerain_JP/glossary.html) lists names of people, places and organizations in English and Japanese.

## About this repository

- [DATA_EN.md](DATA_EN.md) — The translation data (JSON / CSV): format and columns of `entity/`, `dialogue/`, `ui/` and `glossary`
- [HOW_IT_WORKS.md](HOW_IT_WORKS.md) — How the patch was made (English and Japanese)
- [LICENSE](LICENSE)

## Links

[Site](https://t1763.github.io/Suzerain_JP/) ・ [Report a problem](https://t1763.github.io/Suzerain_JP/report.html) ・ [For testers](https://t1763.github.io/Suzerain_JP/tester.html) ・ [Official Discord](https://discord.com/servers/suzerain-universe-473940883906232360)

This site and patch are an unofficial fan project, but we are in contact with the developer, Torpor Games.
