# Publication history and owner workflow

[Development history](development-history.md) · [Current adoption](adoptions/0.2.1.md)

All commits and pushes are performed by the owner. Dates and author identity remain factual; earlier design stages are not represented as backdated Git records.

## Recorded public stages

| Commit | Result |
| --- | --- |
| `55e83a3` | Accepted first implementation, source geometry, generated assets and design/research documentation |
| `7f9c791` | Public structure, English documentation, offline gallery, verification and pinned website-package export |
| `dc036c3` | Actual first adoption record, 0.1.0 |
| `de6460a` | Full musical generator and initial conservative micro filter, 0.2.0 |
| `9145a47` | Author approval of every supported micro combination and compact-mark export, 0.2.1 |

Version 0.2.1 is now deployed on empytree.com. The [record](adoptions/0.2.1.md) identifies its full public source SHA and public checks. Private consumer commits and infrastructure are not part of this history.

## Documentation refresh

The current documentation change records the 0.2.1 adoption, replaces outdated summaries with the full family, puts an up-to-date image first in both READMEs, synchronizes current texts and labels historical comparisons. It changes no deployed geometry or selector behavior and needs no website re-export.

A suitable owner-created commit is `docs: refresh identity overview and current adoption`. Review the diff and generated sheets, then commit and push through the owner's normal workflow. No history reset or reconstructed earlier commits are needed.

Future drawing/runtime changes require a new version, pinned export, consumer rollout and a factual adoption record after the rollout.

## По-русски

Первые пять публичных этапов уже выполнены владельцем. Текущий changeset — актуальная документация, сводные изображения и запись внедрения 0.2.1. Его можно оформить одним коммитом документации. На сайте ничего повторно выкладывать не нужно: используемый SHA и графика сохраняются. Коммиты и push выполняет владелец.

## Следующий связный коммит — 0.3.0

После просмотра выполнить владельцу один исходный коммит `feat: add full-canvas themes and multi-resolution favicons`, затем push. Только после этого экспортировать release по полному SHA; development-пакет не подменяет происхождение релиза. Далее обновить потребителя, проверить реальную выкладку и отдельно записать внедрение. Прежний тег 0.2.1 не перемещать.
