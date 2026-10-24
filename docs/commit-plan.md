# Initial publication and commit plan

[Русский README](../README.ru.md) · [Development history](development-history.md)

The initial history should be factual. Do not backdate commits to manufacture a timestamp for earlier design work. The session's decisions are recorded in the development history; a Git commit created now is a current summary or snapshot of that work.

The owner creates all commits and performs all pushes. Preparation of files, snapshots and this plan does not authorize automated commits or publication.

## Two initial commits

1. **`feat: establish the accepted empytree logo system`** — import the actual end-of-design snapshot: geometry, accepted policy, generated assets, 12 checks, Russian construction rules, optical comparisons, authorship and the first research/count reports. This is a complete recorded snapshot, not a claim that every earlier sketch already existed in Git.
2. **`build: prepare public documentation and pinned website packages`** — add the public `empytree/logo` structure, English README/specification/usage/authorship, Russian navigation, standalone gallery, development and rollout records, pinned dependencies, verification workflow and the limited website-package exporter with tests.

Use the real commit date and the owner's actual configured author identity. The second commit is the first publication candidate for package version 0.1.0. A public release is not asserted until the owner creates it. Existing owner-created repository commits must be preserved rather than reset or replaced to force this plan.

## Adoption commit after website rollout

After the website actually adopts the released package, add a separate commit such as **`docs: record the first favicon adoption on empytree.com`**. Record the full public source commit, package version, date, scope and public validation. Never fill this record in advance or publish the private consumer's repository, internal commit identifiers or deployment details.

The next generator work and micro exclusion groups form a new release after that milestone. They must not be described as implemented by the initial two commits.

## Кратко по-русски

Предлагаются два начальных коммита: реальный сохранённый результат проектирования и затем подготовка к публичному использованию с двуязычной документацией и дистрибутивом. Запись внедрения — отдельный последующий коммит после реального подключения на сайте. Журнал решений сохраняет историю разработки без искусственных дат. Все коммиты и push выполняет владелец. Окончательная политика прав требует отдельного решения владельца; этот документ её не устанавливает.
