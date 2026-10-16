# 背景画像の生成プロンプト（B. 危険探し用）

画像を差し替える手順：

1. 下のプロンプトで画像を生成する（**横4:3、2000×1500px 推奨**）
2. `public/images/stage-1.webp` などに置く
3. `src/data/stages.ts` の該当段階に `image: 'images/stage-1.webp'`（先頭に `/` を付けない） を追加
4. 画面右上の「位置編集（開発用）」で、危険の円を画像の中の危険な人・物に合わせる
5. 「JSONをコピー」した座標を `src/data/hazards.ts` に反映

> 生成AIは「同じ構図のまま建物だけ育てる」「狙った位置に細かい危険を描く」のが苦手です。
> 1枚目（段階1）を基準画像にして、2枚目以降は image-to-image（参照画像）で構図を固定するのがおすすめです。
> 危険な人物がうまく描けない場合は、背景だけ生成して、人物は SVG のまま重ねる方法も検討します。

## 共通（すべての段階の先頭に付ける）

```
Photorealistic architectural cutaway illustration of a 10-story reinforced concrete office building
construction site in a Japanese city, orthographic cross-section view from the front,
building centered, 1 basement floor with pits below, rooftop visible, ceiling plenum of each floor visible.
Street and site gate on the left edge, site office on the right edge, temporary fence around the site.
Muted realistic colors like real construction site photos (concrete gray, galvanized steel, green mesh sheets,
white and yellow hard hats). Workers drawn at real human proportions (not chibi, not cartoon),
with visible helmet chin straps, full-body harness hooks, and armbands.
Overcast daylight, high detail, no text, no watermark. Aspect ratio 4:3.
Same camera position and same framing as the reference image.
```

## 段階ごとの追加

### 1. 着工・仮設
```
Empty leveled lot with steel road plates, temporary fence and gate, two-story prefab site office,
temporary power pole. One backhoe leveling ground.
Hazards to include: a worker standing right behind the backhoe's counterweight inside its swing radius;
a worker carrying wooden stakes with the helmet chin strap hanging loose.
```

### 2. 土工・山留め・杭
```
Deep excavation (about 7 m) retained by H-pile and timber lagging walls with ground anchors,
cast-in-place pile heads at the bottom, small excavator digging at the bottom, mobile crane at ground level
lifting a bundle of steel beams over the pit, dump truck at the gate.
Hazards: a worker walking directly under the suspended steel bundle; a worker standing at the excavation
edge where the barricade has been removed and is lying on the ground; a worker holding a leveling staff
right in front of the excavator bucket.
```

### 3. 基礎・地下躯体
```
Foundation mat and basement pits completed, basement slab cast, basement walls with plywood formwork
and protruding rebar, tower crane on the right lifting a rebar bundle.
Hazards: a worker climbing down a ladder through a manhole into a pit without a gas detector or ventilation fan;
a worker walking under the suspended rebar bundle; an extension cord on the wet floor with torn insulation
and exposed wires.
```

### 4. 地上躯体
```
Concrete frame completed up to the 6th floor, 7th floor deck with plywood formwork, shoring and rebar,
column rebar sticking up, exterior scaffolding with mesh sheets on both sides, tower crane.
Hazards: a scaffolder at the top unrailed scaffold level with harness hook not attached;
one scaffold level with the handrail removed and the pipe lying on the plank; an uncovered floor opening
on the 5th floor with a worker walking backwards toward it while carrying a board.
```

### 5. 外装・設備前半
```
Concrete frame topped out with rooftop penthouse, full-height scaffolding, windows installed on lower floors,
ducts, pipes, sprinkler lines and cable trays being installed in ceiling plenums, water tank and pumps in the basement,
construction hoist on the left side, tower crane lifting a chiller to the roof, roof waterproofing in progress.
Hazards: the construction hoist overloaded with materials stacked above its guardrail;
materials piled high on a narrow scaffold plank; a worker using an angle grinder with sparks and no safety glasses.
```

### 6. 内装・設備後半
```
Scaffolding and tower crane removed, facade finished, ceilings boarded on lower floors and ceiling grid on upper floors,
insulated pipes and ducts, toilets being installed, elevator car in the shaft, chillers on the roof.
Hazards: a worker standing on the top cap of a stepladder; a worker welding a pipe next to cardboard boxes
and glass wool rolls with no fire extinguisher nearby; a worker carrying gypsum board with the chin strap loose.
```

### 7. 仕上げ・検査・引渡し
```
Building completed, all ceilings with lights on, furniture on office floors, landscaping and trees in front,
site office being dismantled, inspection team with clipboards, technician commissioning rooftop chillers.
Hazards: cardboard boxes stacked in front of an emergency exit door with a green exit sign;
a floor-cleaning machine's extension cord with torn insulation on a wet floor.
```
