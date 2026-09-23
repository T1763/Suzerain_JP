# How the Suzerain Japanese fan-translation was made / Suzerain 日本語化の作り方

Unofficial Japanese localization of **Suzerain** (Windows / Steam, in-game version 3.1.0 Build 175, Unity 6000.3.9f1, IL2CPP, Addressables 2.8.1).
Written in reply to the studio's question: *"what I don't get is how you made the game follow along."*

English first, Japanese below. **Both sections say exactly the same thing.**
英語が先、日本語が後です。**両者の内容は同一です。**

---

## A note on who wrote this / この文書について

> I was running **Claude Code Pro (Opus 5, high effort)** and my own part was the verification work —
> carrying out the steps it told me to, so that the data path causing each failure could be pinned down.
> So rather than paraphrase, I have written the details up here word for word, exactly as they were explained to me.
>
> 私は **Claude Code Pro の Opus 5（エフォート高）** を使い、AIの指示通りに、
> 原因となっている経路を特定するための確認作業をしていたにすぎません。
> そのため、要約せず、説明された内容を一言一句そのままこのMDファイルに記載しています。

---

# English

Hi — happy to explain. Short version: **there is no runtime hook. The game reads exactly the fields it always read; I just changed the values inside the shipped Addressables bundles.** Getting the text *out* is the easy half, as you found — "making the game follow along" is entirely about writing it back into the right place and not touching anything the game uses as an identifier.

## 1. Where the text actually lives (two separate stores)

- `defaultlocalgroup_assets_assets_database_entitytextassets...bundle` — the MonoBehaviour named **"Entity Text Assets"**, in its 73 `*DataJson` string fields (~16.5 MB). Note the same bundle also contains 73 `TextAsset`s with identical content — those are editor-side leftovers and **editing them does nothing at runtime.** That cost me a day early on.
- `database_assets_all...bundle` — the **Pixel Crushers Dialogue System** database (MonoBehaviour "Suzerain"), from your articy:draft export. Only `en` and `Menu Text en` are display text (109,717 + 13,821 entries). `Title` is the articy node name and `Sequence` is staging commands — neither is translatable.

## 2. How it gets written back

Your Addressables bundles ship **with type trees intact**, so UnityPy can round-trip the MonoBehaviour without any Unity project:

```python
env = UnityPy.load(src)
obj = next(o for o in env.objects
           if o.type.name == 'MonoBehaviour' and o.read().m_Name == 'Entity Text Assets')
tt = obj.read_typetree()
tt['StoryPackDataJson'] = translated_json_string
obj.save_typetree(tt)
data = env.file.save(packer='original')   # keep the original compression flags
```

Then the file is written back **under its original filename, hash suffix and all**. Addressables does not CRC-check local bundles here, so the catalog needs no edit. That is the whole "following along" mechanism — the game never knows anything changed. Everything is rebuilt from the pristine bundle on every pass; I never stack diffs.

## 3. The part that actually took the time: strings that are secretly keys

Several systems resolve by **string equality at runtime**, so translating one side silently breaks them — with **no exception in `Player.log` at all** (IL2CPP swallows them inside async chains):

- `MapTokenData` → `DemographicsProperties.EthnicityDatas[].Name` and `ReligionDatas[].Name`: translate either one and **the entire in-game HUD stops being built** on save load. The map still draws, ESC menu still works, no error. They match `CodexEntryData.Keywords[]`, which has no localization key. I leave these two paths in English permanently.
- `TokenStatusEffectProperties.CodexEntryTitle` and `MapTokenProperties.Title` must be translated **in the same pass and to the same string** as `CodexEntryData.Title`, or "Open Codex Entry" goes dead on all 54 cities — button highlights, clicks, does nothing.
- Codex body links are drawn by finding `Keywords[]` (English) inside `Description`. Translating the body kills every link, so I reinsert the boundaries with U+200B around translated keywords.
- In the dialogue DB, `Variable["RiziaDLCText.X"]` values appear in `Initial Value`, in `userScript` assignments **and** in `conditionsString` comparisons. They must be translated identically in all three or branching breaks.

**The reliable rule I ended up with: `LocalizationConsts` (`locconsts.txt`, 596 keys in the form `<ENTITY>_PROPERTIES_<FIELD>`) is the authoritative whitelist.** If you shipped a loc key for a field, it's safe to translate; if you didn't, treat it as an identifier. That single heuristic predicted every breakage above. For an official localization none of this is a problem, of course — you'd translate everything at once.

## 4. Everything else, briefly

- Fonts needed no work — `fonts_others` already contains NotoSerifJP, and TMP renders Japanese fine.
- TMP breaks Japanese between any two characters, so newspaper headlines split mid-word. I wrap each phrase in `<nobr>` at build time.
- A handful of hardcoded UI strings aren't in any bundle. Those are byte-length-preserving patches in `global-metadata.dat` and `data.unity3d` — ugly, and something you'd solve properly with a loc key.
- Translation itself is a local 7B MT model (job JSON in, results out), then a generator applies the glossary, tone rules per speaker, bracket/tag handling, and refuses to emit anything that fails self-check (tag/placeholder/variable parity, line counts). Then the rebuilt bundle is read back and **every field is compared one by one** against expectation before install.

Scale, for reference: 123,538 dialogue fields plus 21,772 entity strings, ~13.3 M characters of English.

**If it's useful, I can export the whole thing as plain JSON/CSV** — source string, path/entry ID, speaker, scene, translation — with machine paths stripped. It's keyed to your own IDs, so it would drop straight into an official localization pipeline. Happy to hand it over once the proofreading pass is done.

---

# 日本語

はじめまして。まず結論から。**実行時に割り込む仕組みは一切使っていません。ゲームは元から読んでいる欄をそのまま読んでいて、こちらは配布されている Addressables バンドルの中身（値）を書き換えただけです。** テキストを取り出すのは、おっしゃる通り簡単な方です。「ゲームが追随する」のは、正しい場所に書き戻すことと、**ゲームが識別子として使っている文字列に触らないこと**、この2点だけで決まります。

## 1. テキストの所在（2か所に分かれている）

- `defaultlocalgroup_assets_assets_database_entitytextassets...bundle` — MonoBehaviour **"Entity Text Assets"** の 73個の `*DataJson` 文字列欄（約16.5MB）。同じバンドルには同内容の `TextAsset` も73個入っていますが、**あちらはエディタ用の残りで、書き換えても実行時には一切反映されません。** 最初にここで1日溶かしました。
- `database_assets_all...bundle` — articy:draft から書き出された **Pixel Crushers Dialogue System** のデータベース（MonoBehaviour "Suzerain"）。表示される文字は `en` と `Menu Text en` だけ（109,717件＋13,821件）。`Title` は articy のノード名、`Sequence` は演出コマンドで、どちらも翻訳対象外です。

## 2. 書き戻し方

Addressables のバンドルに**型ツリーが残っている**ので、Unity プロジェクト無しで UnityPy が MonoBehaviour を読み書きできます。

```python
env = UnityPy.load(src)
obj = next(o for o in env.objects
           if o.type.name == 'MonoBehaviour' and o.read().m_Name == 'Entity Text Assets')
tt = obj.read_typetree()
tt['StoryPackDataJson'] = 訳したJSON文字列
obj.save_typetree(tt)
data = env.file.save(packer='original')   # 元の圧縮フラグを踏襲する
```

これを**ハッシュ付きの元のファイル名のまま**上書きします。ローカルのバンドルには CRC 検証が掛からないので、カタログの書き換えは不要です。「追随させる」の正体はこれだけで、ゲームから見れば何も変わっていません。毎回かならず無改変のバンドルから作り直しており、差分を積み重ねることはしていません。

## 3. 実際に時間が掛かったのは「実は鍵だった文字列」

いくつかの仕組みが実行時に**文字列の完全一致**で解決しているため、片側だけ訳すと静かに壊れます。しかも **`Player.log` に例外が1行も出ません**（IL2CPP の非同期チェーン内で握り潰される）。

- `MapTokenData` の `DemographicsProperties.EthnicityDatas[].Name` と `ReligionDatas[].Name` — どちらか一方でも日本語にすると、セーブをロードしたときに**ゲーム内UIが一切構築されなくなります。** 地図は出るし、ESCのメニューも動くし、エラーも出ません。これらは `CodexEntryData.Keywords[]` と一致していて、そちらにはローカライズキーがありません。この2経路は英語のまま固定しています。
- `TokenStatusEffectProperties.CodexEntryTitle` と `MapTokenProperties.Title` は、`CodexEntryData.Title` と**同じ回で・同じ訳語で**訳さないと、54都市すべての「Open Codex Entry」が沈黙します（押せるし枠も光るのに何も起きない）。
- 事典本文中のリンクは、`Description` の文中から `Keywords[]`（英語）を探して張られています。本文を訳すとリンクが全滅するので、訳したキーワードの前後に U+200B を入れて張り直しています。
- 会話DBでは、`Variable["RiziaDLCText.X"]` の値が「変数表の Initial Value」「`userScript` の代入」「`conditionsString` の比較」の3か所に現れます。同じ訳で揃えないと分岐が壊れます。

**最終的にたどり着いた確実な判断基準は、`LocalizationConsts`（`locconsts.txt`／`<ENTITY>_PROPERTIES_<FIELD>` 形式の596キー）を権威あるホワイトリストとして使うことです。** ローカライズキーが用意されている欄は訳してよい、用意されていない欄は識別子とみなす。この一つの基準で、上記の事故はすべて事前に予測できました。もちろん公式ローカライズなら全部まとめて訳すので、この問題自体が起きません。

## 4. その他（手短に）

- フォントの対応は不要でした。`fonts_others` に NotoSerifJP が入っていて、TMP は日本語を問題なく描画します。
- TMP は日本語をどの文字の間でも折り返すので、新聞の大見出しが単語の途中で割れました。組み立て時に文節ごとに `<nobr>` で囲んでいます。
- どのバンドルにも無いUI固定文言が少数あります。そこは `global-metadata.dat` と `data.unity3d` を**同じバイト数で**置き換えています。筋の悪いやり方で、本来はローカライズキーを用意していただくのが正解です。
- 翻訳そのものはローカルの7B翻訳モデルです（ジョブJSONを投げて結果を受け取る）。そのあと生成器が用語集・話し手ごとの口調・角括弧やタグの扱いを当て、自己検査（タグ／プレースホルダ／変数の個数、行数）に通らないものは書き出しません。さらに、組み立てたバンドルを読み直して**全欄を1件ずつ照合**してから導入しています。

規模の目安：会話123,538欄＋エンティティ21,772件、英字にして約1,330万字です。

**もしお役に立つなら、全体を素の JSON／CSV で書き出してお渡しできます**（原文・経路／項目ID・話し手・場面・訳文。こちらのマシンのパスは除去します）。そちらのIDに紐付いているので、公式のローカライズ工程にそのまま載せられるはずです。校正がひと通り終わり次第、喜んでお渡しします。
