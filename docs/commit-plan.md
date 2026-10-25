# Publication history and owner workflow

[Development history](development-history.md) · [Current adoption](adoptions/0.3.0.md) · [Prepared release notes](releases/0.3.1.md)

All commits, tags and pushes are performed by the owner. Earlier dialogue stages are not backdated Git records.

| Commit | Result |
| --- | --- |
| `55e83a3` | Accepted first construction and original research |
| `7f9c791` | Public structure, bilingual entry, offline gallery and pinned export |
| `dc036c3` | First adoption record, 0.1.0 |
| `de6460a` | Full generator and initial conservative micro filter |
| `9145a47` | All supported micro combinations approved; compact export, 0.2.1 |
| `61e4f12` | Current-family documentation and visual sheets |
| `f27cb6e` | Two opaque palettes, full canvas and ten resolutions per ICO, 0.3.0 |

Version 0.3.0 is deployed and publicly verified. Its record preserves the actual source SHA and opaque files. Private consumer source and infrastructure are excluded.

## Prepared 0.3.1

The next coherent owner commit records verified 0.3.0 adoption and implements transparency/color clarification. Suggested message: `feat: export transparent marks and document color flexibility`.

After that commit and successful verification, export a clean pinned 0.3.1 package. Update the consumer under a new versioned URL, verify real delivery, and record adoption separately. Do not overwrite 0.3.0 files or move v0.2.1.

The v0.3.1 release uses the owner's final source/documentation snapshot, with its deployed package SHA stated separately if documentation was committed later. Create an annotated tag only after the intended final commit, then attach the verified consumer archive and SHA256SUMS. Tag/push/release publication remains an owner action.

## По-русски

0.3.0 уже внедрена. Следующий коммит объединяет фактическую запись внедрения и прозрачную 0.3.1 с рекомендованными, изменяемыми при творческой необходимости цветами линий. После owner commit/push экспортируется настоящий пакет по SHA. Тег и релиз v0.3.1 фиксируют итоговое состояние; исходный SHA пакета сохраняется отдельно от позднейших коммитов документации. Опубликованные URL и теги не перемещаются.
