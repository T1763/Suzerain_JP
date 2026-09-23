# Suzerain 非公式日本語訳データ / Unofficial Japanese translation data for Suzerain

https://t1763.github.io/Suzerain_JP/

ゲーム **Suzerain**（3.1.0 (Windows) Build 175 / Unity 6000.3.9f1 / Windows / Steam）の、非公式の日本語訳データです。
Unofficial Japanese translation data for **Suzerain** (3.1.0 (Windows) Build 175 / Unity 6000.3.9f1 / Windows / Steam).

- 生成日 / Generated: 2026-09-23
- ゲームのファイル（バンドル等）は含みません。訳文だけです。 / No game files are included — translations only.
- **英語の原文は含みません**。各行はゲーム内の ID と日本語訳だけを持ちます。原文はお手持ちのゲームのデータと ID で突き合わせてください。
  **The English source text is not included.** Each row carries only the in-game ID and the Japanese text; join it with your own copy of the game data by ID.
- 作り方は `HOW_IT_WORKS.md` を参照。 / See `HOW_IT_WORKS.md` for how the translation is applied to the game.

## 日本語化の入れ方・英語に戻す / Installing and reverting

入れ方はサイト https://t1763.github.io/Suzerain_JP/ を参照（Releases の ZIP を展開し、中の `Suzerain_Data` フォルダをゲームのフォルダへ上書き。スクリプトは実行しません）。
配布物に英語の元のファイルは入っていません。**英語に戻すときは Steam でゲームファイルをリフレッシュします。**
See the site for installation (unzip the Release and drag its `Suzerain_Data` folder over the game folder, replacing files; nothing is executed). The English original files are not shipped;
**to go back to English, let Steam refresh the game files:**

1. Suzerain を終了する / Quit Suzerain.
2. Steam の「ライブラリ」で Suzerain を右クリック →「プロパティ」 / In the Steam Library, right-click Suzerain → **Properties**.
3. 「インストール済みファイル」→「ゲームファイルの整合性を確認」 / **Installed Files** → **Verify integrity of game files**.
4. 置き換えたファイル（約100MB）が取り直され、英語に戻ります。セーブデータは消えません。 /
   The replaced files (about 100 MB) are downloaded again and the game is back in English. Save data is not affected.

## ファイル / Files

各データは同じ内容の `.json`（UTF-8）と `.csv`（UTF-8 BOM 付き・RFC 4180。改行を含む欄は引用符で囲む）の2形式です。
Every dataset is provided twice with identical content: `.json` (UTF-8) and `.csv` (UTF-8 with BOM, RFC 4180; fields containing line breaks are quoted).

| ファイル / File | 行数 / Rows | 内容 / Contents |
|---|---:|---|
| `entity/AdvisorsPageData` | 2 | 画面の文字 / On-screen text |
| `entity/ArchetypeData` | 9 | 画面の文字 / On-screen text |
| `entity/BillData` | 104 | 画面の文字 / On-screen text |
| `entity/CarouselChoiceOptionData` | 137 | 画面の文字 / On-screen text |
| `entity/CarouselChoicePageData` | 32 | 画面の文字 / On-screen text |
| `entity/CharacterCustomizationOptionData` | 99 | 画面の文字 / On-screen text |
| `entity/CharacterCustomizationPanelData` | 8 | 画面の文字 / On-screen text |
| `entity/CharacterDetailsPanelData` | 4 | 画面の文字 / On-screen text |
| `entity/CharacterDetailsSectionData` | 113 | 画面の文字 / On-screen text |
| `entity/CodexEntryData` | 2,815 | 画面の文字 / On-screen text |
| `entity/CodexTopicData` | 27 | 画面の文字 / On-screen text |
| `entity/CollectionItemData` | 76 | 画面の文字 / On-screen text |
| `entity/CompassCharacterGroupData` | 2 | 画面の文字 / On-screen text |
| `entity/CompassConfigurationData` | 8 | 画面の文字 / On-screen text |
| `entity/CompassData` | 2 | 画面の文字 / On-screen text |
| `entity/CompassTitleData` | 34 | 画面の文字 / On-screen text |
| `entity/CompositionData` | 22 | 画面の文字 / On-screen text |
| `entity/CompositionPageData` | 6 | 画面の文字 / On-screen text |
| `entity/ConnectionData` | 151 | 画面の文字 / On-screen text |
| `entity/ConnectionPositionData` | 21 | 画面の文字 / On-screen text |
| `entity/ConversationData` | 528 | 画面の文字 / On-screen text |
| `entity/CountryDetailsDemographicData` | 30 | 画面の文字 / On-screen text |
| `entity/CountryDetailsPanelData` | 14 | 画面の文字 / On-screen text |
| `entity/DLCCollectionItemData` | 4 | 画面の文字 / On-screen text |
| `entity/DecisionData` | 2,222 | 画面の文字 / On-screen text |
| `entity/DecreeData` | 951 | 画面の文字 / On-screen text |
| `entity/FactionData` | 12 | 画面の文字 / On-screen text |
| `entity/FactionsPageData` | 2 | 画面の文字 / On-screen text |
| `entity/GraphPanelData` | 2 | 画面の文字 / On-screen text |
| `entity/HUDPeriodicStatModifierData` | 126 | 画面の文字 / On-screen text |
| `entity/HUDStatData` | 13 | 画面の文字 / On-screen text |
| `entity/HUDTextStatData` | 6 | 画面の文字 / On-screen text |
| `entity/JournalEntryData` | 1,806 | 画面の文字 / On-screen text |
| `entity/MapTokenData` | 302 | 画面の文字 / On-screen text |
| `entity/MultipleChoiceOptionData` | 123 | 画面の文字 / On-screen text |
| `entity/MultipleChoicePageData` | 82 | 画面の文字 / On-screen text |
| `entity/NewsData` | 5,596 | 画面の文字 / On-screen text |
| `entity/OneTimeDecreesPanelData` | 2 | 画面の文字 / On-screen text |
| `entity/PagedDecisionPanelData` | 35 | 画面の文字 / On-screen text |
| `entity/PolicyData` | 640 | 画面の文字 / On-screen text |
| `entity/ReminderPanelData` | 12 | 画面の文字 / On-screen text |
| `entity/ReminderPanelSegmentData` | 62 | 画面の文字 / On-screen text |
| `entity/ReportData` | 3,365 | 画面の文字 / On-screen text |
| `entity/ReusableDecreesPanelData` | 1 | 画面の文字 / On-screen text |
| `entity/SituationData` | 1,058 | 画面の文字 / On-screen text |
| `entity/StoryPackData` | 36 | 画面の文字 / On-screen text |
| `entity/SummaryData` | 2 | 画面の文字 / On-screen text |
| `entity/SummarySegmentData` | 220 | 画面の文字 / On-screen text |
| `entity/TimelineElementData` | 64 | 画面の文字 / On-screen text |
| `entity/TokenStatusEffectData` | 600 | 画面の文字 / On-screen text |
| `entity/TooltipData` | 108 | 画面の文字 / On-screen text |
| `entity/TutorialPageData` | 36 | 画面の文字 / On-screen text |
| `entity/TutorialPanelData` | 2 | 画面の文字 / On-screen text |
| `entity/WarFragmentData` | 14 | 画面の文字 / On-screen text |
| `entity/WarProductionPanelData` | 2 | 画面の文字 / On-screen text |
| `entity/_GameFlow` | 22 | 画面の文字 / On-screen text |
| `dialogue/sord01` | 1,865 | 会話 / Dialogue |
| `dialogue/sord02` | 3,305 | 会話 / Dialogue |
| `dialogue/sord03` | 5,131 | 会話 / Dialogue |
| `dialogue/sord04` | 2,800 | 会話 / Dialogue |
| `dialogue/sord05` | 3,467 | 会話 / Dialogue |
| `dialogue/sord06` | 4,092 | 会話 / Dialogue |
| `dialogue/sord07` | 8,992 | 会話 / Dialogue |
| `dialogue/sord08` | 8,796 | 会話 / Dialogue |
| `dialogue/sord09` | 6,787 | 会話 / Dialogue |
| `dialogue/sord10` | 8,221 | 会話 / Dialogue |
| `dialogue/sord11` | 2,974 | 会話 / Dialogue |
| `dialogue/sordend` | 1,918 | 会話 / Dialogue |
| `dialogue/riz01` | 2,863 | 会話 / Dialogue |
| `dialogue/riz02` | 2,373 | 会話 / Dialogue |
| `dialogue/riz03` | 2,518 | 会話 / Dialogue |
| `dialogue/riz04` | 4,333 | 会話 / Dialogue |
| `dialogue/riz05` | 5,942 | 会話 / Dialogue |
| `dialogue/riz06` | 5,648 | 会話 / Dialogue |
| `dialogue/riz07` | 6,815 | 会話 / Dialogue |
| `dialogue/riz08` | 10,483 | 会話 / Dialogue |
| `dialogue/riz09` | 5,644 | 会話 / Dialogue |
| `dialogue/riz10` | 14,023 | 会話 / Dialogue |
| `dialogue/riz11` | 2,283 | 会話 / Dialogue |
| `dialogue/rizend` | 2,265 | 会話 / Dialogue |
| `dialogue/variables` | 161 | 文字列変数 / String variables |
| `ui/mainmenu` | 170 | 固定文言 / UI strings |
| `ui/ingame` | 276 | 固定文言 / UI strings |
| `ui/program` | 18 | 固定文言 / UI strings |
| `ui/boot` | 1 | 固定文言 / UI strings |
| `glossary` | 633 | 用語集 / Glossary |

### entity/`<種別 type>` — 画面の文字 / On-screen text

`defaultlocalgroup_assets_assets_database_entitytextassets_*.bundle` の MonoBehaviour **"Entity Text Assets"** にある `<type>DataJson` 文字列（JSON）の中身。
Contents of the `<type>DataJson` string (itself JSON) in the MonoBehaviour **"Entity Text Assets"**.

| 列 / Column | 意味 / Meaning |
|---|---|
| `type` | データ種別（`StoryPackData` など） / Data type |
| `item_id` | `items[].Id`（articy の ID） / articy ID of the item |
| `name_in_database` | `items[].NameInDatabase` |
| `path` | 項目の中での欄の位置（例 `StoryPackProperties.Fields[0].Value`） / Field location inside the item |
| `ja` | 日本語訳 / Japanese text |

### dialogue/`<範囲 scope>` — 会話 / Dialogue

`database_assets_all_*.bundle` の Dialogue System for Unity データベース（MonoBehaviour "Suzerain"）。
範囲は会話名の先頭で分けています（`sord01`＝ソードランド編の序章とターン1、`riz01`＝リジア編の序章とターン1、`*end`＝エンディング等）。
The Dialogue System for Unity database (MonoBehaviour "Suzerain"). Split by conversation title prefix (`sord01` = Sordland prologue + turn 1, `riz01` = Rizia prologue + turn 1, `*end` = endings etc.).

| 列 / Column | 意味 / Meaning |
|---|---|
| `articy_id` | 項目の `Articy Id` / The entry's `Articy Id` |
| `conversation_id`, `entry_id` | Dialogue System の会話 ID・項目 ID / Conversation and entry IDs |
| `conversation` | 会話の `Title`（articy のノード名・識別子） / Conversation `Title` (identifier) |
| `actor` | 話し手の内部名 / Speaker's internal actor name |
| `field` | `en`（本文 / body text）または `Menu Text en`（選択肢 / choice text） |
| `ja` | 日本語訳 / Japanese text |

`dialogue/variables` は文字列変数 `{RiziaDLCText.*}` などの値です。`where` が `initial` の行は変数表の Initial Value、それ以外は
その項目（`articy_id`）の `userScript`（代入）または `conditionsString`（比較）に出てくる値です。**代入と比較は同じ訳にしないと分岐が壊れます。**
`dialogue/variables` holds string-variable values. `where = initial` is the variable table's Initial Value; otherwise it is the value in that entry's
`userScript` (assignment) or `conditionsString` (comparison). **Assignments and comparisons must use the same translation or branching breaks.**

### ui/ — 固定文言 / Fixed UI strings

`key` は英文そのものです。メニューの `locaId` もプログラム内の文字列も、英文がそのままキーになっているためです。
`key` is the English string itself, because both the menu `locaId` and the in-program strings use the English text as the key.

- `ui/mainmenu`, `ui/ingame` — 場面のバンドル内の TextMeshPro（`locaId` と `m_text`） / TextMeshPro in scene bundles
- `ui/program` — `global-metadata.dat` の文字列（同じ位置で置き換え） / String literals in `global-metadata.dat`
- `ui/boot` — `data.unity3d` level0 の起動画面 / Launch screen in `data.unity3d` level0

### glossary — 用語集 / Glossary

作業用の用語集（`en, ja, category, tier`）。**実際の訳文と違う項目があります。食い違うときは entity/ と dialogue/ の訳文が正です。**
The working glossary. **Some entries differ from the final translations; where they disagree, entity/ and dialogue/ are authoritative.**

## 注意 / Caveats

- **訳してはいけない欄があります。**`MapTokenData` の `DemographicsProperties.EthnicityDatas[].Name` と `ReligionDatas[].Name` を
  訳すと、セーブのロード時にゲーム内の UI が構築されなくなります（ログにエラーは出ません）。このデータでは英語のままです。
  **Some fields must not be translated.** Translating `EthnicityDatas[].Name` / `ReligionDatas[].Name` in `MapTokenData` stops the in-game HUD
  from being built on save load (with no error in the log). They are left in English here.
- 対になっている欄（`CodexEntryData.Title` と `MapTokenProperties.Title`／`TokenStatusEffectProperties.CodexEntryTitle`）は同じ訳語です。
  Paired fields (`CodexEntryData.Title` with `MapTokenProperties.Title` / `TokenStatusEffectProperties.CodexEntryTitle`) share the same string.
- `{0}` などのプレースホルダ・タグ・角括弧は原文と同じものを含みます。 / Placeholders, tags and brackets match the source.
- ゲーム版が違うと ID や欄の位置が変わることがあります。`manifest.json` の MD5 で版を確かめられます。
  IDs and field locations may change between game versions; check the MD5s in `manifest.json`.
- 翻訳はローカルの翻訳モデルの出力を規則と手作業で校正したものです。校正は途中です。
  Machine translation (local model) corrected by rules and by hand. Proofreading is still in progress.
