# Change the project spec

When the user wants to change a project-wide rule, edit `.trellis/spec/spec.md`.

## Read this file first

`.trellis/spec/spec.md`

Session start already includes it. There is one spec file. Do not add a layer directory, an `index.md`, or a guides directory.

## Where a change goes

| Need | Edit location |
| --- | --- |
| A rule that applies no matter which task is running | `.trellis/spec/spec.md` |
| A fixed procedure for one situation | A project skill. Do not put it in `spec.md`. |
| Repository package layout | `packages` / `default_package` in `.trellis/config.yaml` |

## Notes

- Edit `spec.md` only when the user asks. There is no spec-update skill.
- Do not review a finished task for a spec or a skill on your own.
- Do not put temporary task information into `spec.md`. Put that in the task.
- Do not list `spec.md` in `implement.jsonl` or `check.jsonl`. Session start already reads it.
