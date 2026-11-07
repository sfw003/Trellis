# Add Project-Local Conventions

Often the user does not need to change Trellis mechanics; they need local AI to understand their team's conventions. In that case, prefer `.trellis/spec/` or a project-local skill instead of editing `trellis-meta`.

## Where To Put Things

| Content type | Location |
| --- | --- |
| A rule that applies no matter which task is running | `.trellis/spec/spec.md` |
| A fixed procedure for one situation | A project skill |
| One-off task material | `.trellis/tasks/<task>/` |
| Session summary | `.trellis/workspace/<developer>/journal-N.md` |

## Create A Project-Local Skill

If the user wants AI to know "how this project customizes Trellis," create a local skill:

```text
.claude/skills/trellis-local/
└── SKILL.md
```

Example:

```md
---
name: trellis-local
description: "Project-local Trellis customizations for this repository. Use when changing this project's Trellis workflow, hooks, local agents, or team-specific conventions."
---

# Trellis Local

## Local Scope

This skill documents this repository's Trellis customizations only.

## Custom Workflow Rules

- ...

## Local Hook Changes

- ...

## Local Agent Changes

- ...
```

For multi-platform projects, place equivalent versions in other platform skill directories, or use `.agents/skills/` for platforms that support the shared layer.

## Write to `.trellis/spec/spec.md`

If the user asks to record a project-wide rule, add it to `.trellis/spec/spec.md`. Session start reads that file. Do not create another spec file, and do not add the file to task JSONL.

A fixed procedure for one situation is a project skill, not a spec entry.

## Do Not Store Project-Private Rules In `trellis-meta`

`trellis-meta` is a public skill for understanding Trellis architecture and local customization entry points. Put project-private content in:

- `.trellis/spec/`
- a project-local skill
- the current task
- workspace journal

This prevents future updates to Trellis's built-in `trellis-meta` from overwriting the team's own conventions.
