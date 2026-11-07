# Local Spec System

`.trellis/spec/spec.md` is the only spec file. It holds short project-wide rules: what a part of the repository is for, and rules that apply no matter which task is running. This is the same kind of text that belongs in a project `AGENTS.md`.

Session start reads that file into the conversation. There is no spec layer, no per-layer `index.md`, and no guides directory.

## What belongs in spec.md

- What a part of the repository is for.
- A rule that applies no matter which task is running.

A fixed procedure for one situation belongs in a project skill. The skill description is the situation; the body is the steps. Write either one only when the user asks. Do not review a finished task for a spec or a skill on your own.

When the user asks to record a project-wide rule, edit `.trellis/spec/spec.md` directly. There is no spec-update skill.

## Package configuration

`.trellis/config.yaml` can still declare packages so task context knows the repository layout:

```yaml
packages:
  cli:
    path: packages/cli
  docs-site:
    path: docs-site
    type: submodule
default_package: cli
```

The AI can run:

```bash
python3 ./.trellis/scripts/get_context.py --mode packages
```

This command lists packages. It does not select spec files.

## How the spec enters a session

Session start inlines `.trellis/spec/spec.md`. Do not also list that file in `implement.jsonl` or `check.jsonl`. Those files are for research notes the sub-agent needs.

## Local Customization Points

| Need | Edit location |
| --- | --- |
| Add or change a project-wide rule | `.trellis/spec/spec.md` |
| Add a situation-specific procedure | A project skill in the platform skill directory |
| Change monorepo package mapping | `packages` / `default_package` in `.trellis/config.yaml` |

## Boundaries

`.trellis/spec/spec.md` is the user's project specification. Write what the code actually does. Aspirational patterns that are not in the codebase do not belong there.
