[![GitHub Tag Major](https://img.shields.io/github/v/tag/cssnr/toml-action?sort=semver&filter=!v*.*&logo=git&logoColor=white&labelColor=585858&label=%20)](https://github.com/cssnr/toml-action/tags)
[![GitHub Tag Minor](https://img.shields.io/github/v/tag/cssnr/toml-action?sort=semver&filter=!v*.*.*&logo=git&logoColor=white&labelColor=585858&label=%20)](https://github.com/cssnr/toml-action/releases)
[![GitHub Release Version](https://img.shields.io/github/v/release/cssnr/toml-action?logo=git&logoColor=white&labelColor=585858&label=%20)](https://github.com/cssnr/toml-action/releases/latest)
[![GitHub Dist Size](https://img.shields.io/github/size/cssnr/toml-action/dist%2Findex.js?logo=bookstack&logoColor=white&label=dist%20size)](https://github.com/cssnr/toml-action/blob/master/src)
[![Workflow Release](https://img.shields.io/github/actions/workflow/status/cssnr/toml-action/release.yaml?logo=cachet&label=release)](https://github.com/cssnr/toml-action/actions/workflows/release.yaml)
[![Workflow Test](https://img.shields.io/github/actions/workflow/status/cssnr/toml-action/test.yaml?logo=cachet&label=test)](https://github.com/cssnr/toml-action/actions/workflows/test.yaml)
[![Workflow Lint](https://img.shields.io/github/actions/workflow/status/cssnr/toml-action/lint.yaml?logo=cachet&label=lint)](https://github.com/cssnr/toml-action/actions/workflows/lint.yaml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=cssnr_toml-action&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=cssnr_toml-action)
[![GitHub Repo Size](https://img.shields.io/github/repo-size/cssnr/toml-action?logo=bookstack&logoColor=white&label=repo%20size)](https://github.com/cssnr/toml-action?tab=readme-ov-file#readme)
[![GitHub Top Language](https://img.shields.io/github/languages/top/cssnr/toml-action?logo=htmx)](https://github.com/cssnr/toml-action?tab=readme-ov-file#readme)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/cssnr/toml-action?logo=github&label=updated)](https://github.com/cssnr/toml-action/pulse)
[![Codeberg Last Commit](https://img.shields.io/gitea/last-commit/cssnr/toml-action/master?gitea_url=https%3A%2F%2Fcodeberg.org%2F&logo=codeberg&logoColor=white&label=updated)](https://codeberg.org/cssnr/toml-action)
[![GitHub Contributors](https://img.shields.io/github/contributors-anon/cssnr/toml-action?logo=github)](https://github.com/cssnr/toml-action/graphs/contributors)
[![GitHub Discussions](https://img.shields.io/github/discussions/cssnr/toml-action?logo=github)](https://github.com/cssnr/toml-action/discussions)
[![GitHub Forks](https://img.shields.io/github/forks/cssnr/toml-action?style=flat&logo=github)](https://github.com/cssnr/toml-action/forks)
[![GitHub Repo Stars](https://img.shields.io/github/stars/cssnr/toml-action?style=flat&logo=github)](https://github.com/cssnr/toml-action/stargazers)
[![GitHub Org Stars](https://img.shields.io/github/stars/cssnr?style=flat&logo=github&label=org%20stars)](https://cssnr.github.io/)
[![Discord](https://img.shields.io/discord/899171661457293343?logo=discord&logoColor=white&label=discord&color=7289da)](https://discord.gg/wXy6m2X8wY)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-72a5f2?logo=kofi&label=support)](https://ko-fi.com/cssnr)

# TOML Action

<a title="TOML Action" href="https://github.com/cssnr/toml-action?tab=readme-ov-file#readme" target="_blank">
<img alt="TOML Action" align="right" width="128" height="auto" src="https://raw.githubusercontent.com/smashedr/repo-images/refs/heads/master/toml-action/logo.png"></a>

- [Features](#Features)
  - [Upcoming](#Upcoming)
- [Comparison](#Comparison)
- [Inputs](#Inputs)
- [Outputs](#Outputs)
- [Tags](#Tags)
- [Support](#Support)
- [Contributing](#Contributing)

[TOML 1.0.0](https://toml.io/en/v1.0.0) Action to Read or Edit Values using JSONPath and Output or Write the Results to Outputs or File.

This action was built from the ground up using active libraries. See the [Comparison](#Comparison) for more details.

Uses [smol-toml](https://github.com/squirrelchat/smol-toml) for TOML parsing and [jsonpath-plus](https://github.com/JSONPath-Plus/JSONPath) for JSONPath.

<details><summary>View Sample TOML File</summary>

```toml
title = "TOML Example"

[project]
name = "toml-action"
dynamic = ["version"]
authors = [{ name="Shane" }]
```

</details>

**Get a Value.**

```yaml
- name: 'TOML Action'
  id: toml
  uses: cssnr/toml-action@v1
  with:
    file: '.github/test/test.toml'
    path: '$.project.authors[0].name'

- name: 'Echo Value'
  run: |
    echo "value: ${{ steps.toml.outputs.value }}"
```

Results: `Shane`

**Edit a Value.**

```yaml
- name: 'TOML Action'
  uses: cssnr/toml-action@v1
  with:
    file: '.github/test/test.toml'
    path: '$.project.authors[0].name'
    value: 'I Made This'

- name: 'Cat File'
  run: |
    cat ".github/test/test.toml"
```

<details><summary>Results: <i>click to view</i></summary>

```toml
title = "TOML Example"

[project]
name = "toml-action"
dynamic = [ "version" ]

[[project.authors]]
name = "I Made This"
```

Note: the results are different from the source, but the structure is identical.

</details>

See the [Inputs](#Inputs) for more options...

## Features

- Use JSONPath
- Read TOML Value
- Edit TOML Value
- Write the Results
- Output JSON Results
- Output TOML Results

### Upcoming

- Convert input File/JSON/YAML to TOML
- Only read TOML File without a Path?

> [!TIP]  
> Please submit a [Feature Request](https://github.com/cssnr/toml-action/discussions/categories/feature-requests)
> to let us know what you want to see...

## Comparison

Most of these actions are forks/clones of each other and none of them support JSONPath or both Read and Write.

| Repository                                                                    | Read | Write | Path | TOML&nbsp;Version | TOML&nbsp;Parser                                       |                                                                                                           Stars                                                                                                           |                                                         Last&nbsp;Updated                                                          | Repository&nbsp;Language                                                                        |
| :---------------------------------------------------------------------------- | :--: | :---: | :--: | :---------------- | :----------------------------------------------------- | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------- |
| [cssnr/toml-action](https://github.com/cssnr/toml-action)                     |  ✅  |  ✅   |  ✅  | `1.0.0`           | [smol-toml](https://github.com/squirrelchat/smol-toml) |           ![Stars](https://img.shields.io/github/stars/cssnr/toml-action?style=flat&label=%20&color=forestgreen) ![Fork](https://img.shields.io/github/forks/cssnr/toml-action?style=flat&label=%20&color=blue)           |      ![Updated](https://img.shields.io/github/last-commit/cssnr/toml-action?style=flat&label=%20&display_timestamp=committer)      | ![Language](https://img.shields.io/github/languages/top/cssnr/toml-action?style=flat)           |
| [SebRollen/toml-action](https://github.com/SebRollen/toml-action)             |  ✅  |  ❌   |  ❌  | `1.0.0-rc.1`      | [iarna/toml](https://github.com/iarna/iarna-toml)      |       ![Stars](https://img.shields.io/github/stars/SebRollen/toml-action?style=flat&label=%20&color=forestgreen) ![Fork](https://img.shields.io/github/forks/SebRollen/toml-action?style=flat&label=%20&color=blue)       |    ![Updated](https://img.shields.io/github/last-commit/SebRollen/toml-action?style=flat&label=%20&display_timestamp=committer)    | ![Language](https://img.shields.io/github/languages/top/SebRollen/toml-action?style=flat)       |
| [ciiiii/toml-editor](https://github.com/ciiiii/toml-editor)                   |  ❌  |  ✅   |  ❌  | `1.0.0-rc.1`      | [iarna/toml](https://github.com/iarna/iarna-toml)      |          ![Stars](https://img.shields.io/github/stars/ciiiii/toml-editor?style=flat&label=%20&color=forestgreen) ![Fork](https://img.shields.io/github/forks/ciiiii/toml-editor?style=flat&label=%20&color=blue)          |     ![Updated](https://img.shields.io/github/last-commit/ciiiii/toml-editor?style=flat&label=%20&display_timestamp=committer)      | ![Language](https://img.shields.io/github/languages/top/ciiiii/toml-editor?style=flat)          |
| [colt-1/toml-editor](https://github.com/colt-1/toml-editor)                   |  ❌  |  ✅   |  ❌  | `1.0.0-rc.1`      | [iarna/toml](https://github.com/iarna/iarna-toml)      |          ![Stars](https://img.shields.io/github/stars/colt-1/toml-editor?style=flat&label=%20&color=forestgreen) ![Fork](https://img.shields.io/github/forks/colt-1/toml-editor?style=flat&label=%20&color=blue)          |     ![Updated](https://img.shields.io/github/last-commit/colt-1/toml-editor?style=flat&label=%20&display_timestamp=committer)      | ![Language](https://img.shields.io/github/languages/top/colt-1/toml-editor?style=flat)          |
| [rahulp959/toml-editor](https://github.com/rahulp959/toml-editor)             |  ❌  |  ✅   |  ❌  | `1.0.0-rc.1`      | [iarna/toml](https://github.com/iarna/iarna-toml)      |       ![Stars](https://img.shields.io/github/stars/rahulp959/toml-editor?style=flat&label=%20&color=forestgreen) ![Fork](https://img.shields.io/github/forks/rahulp959/toml-editor?style=flat&label=%20&color=blue)       |    ![Updated](https://img.shields.io/github/last-commit/rahulp959/toml-editor?style=flat&label=%20&display_timestamp=committer)    | ![Language](https://img.shields.io/github/languages/top/rahulp959/toml-editor?style=flat)       |
| [kaachod/toml-editor](https://github.com/kaachod/toml-editor)                 |  ❌  |  ✅   |  ❌  | `1.0.0-rc.1`      | [iarna/toml](https://github.com/iarna/iarna-toml)      |         ![Stars](https://img.shields.io/github/stars/kaachod/toml-editor?style=flat&label=%20&color=forestgreen) ![Fork](https://img.shields.io/github/forks/kaachod/toml-editor?style=flat&label=%20&color=blue)         |     ![Updated](https://img.shields.io/github/last-commit/kaachod/toml-editor?style=flat&label=%20&display_timestamp=committer)     | ![Language](https://img.shields.io/github/languages/top/kaachod/toml-editor?style=flat)         |
| [sandstromviktor/toml-editor](https://github.com/sandstromviktor/toml-editor) |  ❌  |  ✅   |  ❌  | `1.0.0-rc.1`      | [iarna/toml](https://github.com/iarna/iarna-toml)      | ![Stars](https://img.shields.io/github/stars/sandstromviktor/toml-editor?style=flat&label=%20&color=forestgreen) ![Fork](https://img.shields.io/github/forks/sandstromviktor/toml-editor?style=flat&label=%20&color=blue) | ![Updated](https://img.shields.io/github/last-commit/sandstromviktor/toml-editor?style=flat&label=%20&display_timestamp=committer) | ![Language](https://img.shields.io/github/languages/top/sandstromviktor/toml-editor?style=flat) |
| [dangdennis/toml-action](https://github.com/dangdennis/toml-action)           |  ✅  |  ❌   |  ❌  | `0.4.0`           | [toml](https://github.com/BinaryMuse/toml-node)        |      ![Stars](https://img.shields.io/github/stars/dangdennis/toml-action?style=flat&label=%20&color=forestgreen) ![Fork](https://img.shields.io/github/forks/dangdennis/toml-action?style=flat&label=%20&color=blue)      |   ![Updated](https://img.shields.io/github/last-commit/dangdennis/toml-action?style=flat&label=%20&display_timestamp=committer)    | ![Language](https://img.shields.io/github/languages/top/dangdennis/toml-action?style=flat)      |
| [sebasptsch/toml-edit-action](https://github.com/sebasptsch/toml-edit-action) |  ❌  |  ✅   |  ❌  | `1.0.0`           | [smol-toml](https://github.com/squirrelchat/smol-toml) | ![Stars](https://img.shields.io/github/stars/sebasptsch/toml-edit-action?style=flat&label=%20&color=forestgreen) ![Fork](https://img.shields.io/github/forks/sebasptsch/toml-edit-action?style=flat&label=%20&color=blue) | ![Updated](https://img.shields.io/github/last-commit/sebasptsch/toml-edit-action?style=flat&label=%20&display_timestamp=committer) | ![Language](https://img.shields.io/github/languages/top/sebasptsch/toml-edit-action?style=flat) |
| [Larry-Le/toml-editor](https://github.com/Larry-Le/toml-editor)               |  ❌  |  ✅   |  ❌  | `1.0.0-rc.1`      | [iarna/toml](https://github.com/iarna/iarna-toml)      |        ![Stars](https://img.shields.io/github/stars/Larry-Le/toml-editor?style=flat&label=%20&color=forestgreen) ![Fork](https://img.shields.io/github/forks/Larry-Le/toml-editor?style=flat&label=%20&color=blue)        |    ![Updated](https://img.shields.io/github/last-commit/Larry-Le/toml-editor?style=flat&label=%20&display_timestamp=committer)     | ![Language](https://img.shields.io/github/languages/top/Larry-Le/toml-editor?style=flat)        |

## Inputs

| Input             | Default&nbsp;Value | Description&nbsp;of&nbsp;Input                    |
| :---------------- | :----------------- | :------------------------------------------------ |
| [file](#file)     | _Required_         | TOML File Path                                    |
| [path](#path)     | -                  | [JSONPath](https://jsonpath.com/) to Read or Edit |
| [value](#value)   | -                  | Value to Edit/Update                              |
| [write](#write)   | `true`             | Write Updates to [file](#file)                    |
| [output](#output) | [file](#file)      | Write to a Different File                         |

#### file

This is the TOML file to process.

#### path

A [JSONPath](https://jsonpath.com/) key to read or edit.

Leaving this blank will only read the file and output the JSON/TOML results.

String key: `$.key`  
Nested key: `$.key.nested`  
Array key: `$.key.nested[0]`

#### value

Value to edit/update at the given [path](#path).

Leaving this blank will only read the value from [path](#path) and output the results.

#### write

Write the results with the [value](#value) back to the [file](#file).

To write to a different file, set the [output](#output) to the file path.

Default: `true`

#### output

To [write](#write) the results to a different [file](#file) set the path to the file here.
Directories will be created as necessary.

Default: [file](#file)

## Outputs

| Output | Description  |
| :----- | :----------- |
| value  | Parsed Value |
| data   | JSON Data    |
| toml   | TOML String  |

```yaml
- name: 'TOML Action'
  id: toml
  uses: cssnr/toml-action@v1
  with:
    file: file.toml
    path: author.name

- name: 'Echo Outputs'
  env:
    toml: ${{ steps.toml.outputs.toml }}
  run: |
    echo "value: ${{ steps.toml.outputs.value }}"
    echo "data: ${{ steps.toml.outputs.data }}"
    echo "toml: ${toml}"
```

Note: `toml` is first set as an `env` variable due to the way multi-line output is evaluated using `${{ }}` in a run block.

## Tags

The following rolling [tags](https://github.com/cssnr/toml-action/tags) are maintained.

| Version&nbsp;Tag                                                                                                                                                                                       | Rolling | Bugs | Feat. |   Name    |  Target  | Example  |
| :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-----: | :--: | :---: | :-------: | :------: | :------- |
| [![GitHub Tag Major](https://img.shields.io/github/v/tag/cssnr/toml-action?sort=semver&filter=!v*.*&style=for-the-badge&label=%20&color=44cc10)](https://github.com/cssnr/toml-action/releases/latest) |   ✅    |  ✅  |  ✅   | **Major** | `vN.x.x` | `vN`     |
| [![GitHub Tag Minor](https://img.shields.io/github/v/tag/cssnr/toml-action?sort=semver&filter=!v*.*.*&style=for-the-badge&label=%20&color=blue)](https://github.com/cssnr/toml-action/releases/latest) |   ✅    |  ✅  |  ❌   | **Minor** | `vN.N.x` | `vN.N`   |
| [![GitHub Release](https://img.shields.io/github/v/release/cssnr/toml-action?style=for-the-badge&label=%20&color=red)](https://github.com/cssnr/toml-action/releases/latest)                           |   ❌    |  ❌  |  ❌   | **Micro** | `vN.N.N` | `vN.N.N` |

You can view the release notes for each version on the [releases](https://github.com/cssnr/toml-action/releases) page.

The **Major** tag is recommended. It is the most up-to-date and always backwards compatible.
Breaking changes would result in a **Major** version bump. At a minimum you should use a **Minor** tag.

# Support

For general help or to request a feature, see:

- Q&A Discussion: https://github.com/cssnr/toml-action/discussions/categories/q-a
- Request a Feature: https://github.com/cssnr/toml-action/discussions/categories/feature-requests

If you are experiencing an issue/bug or getting unexpected results, you can:

- Report an Issue: https://github.com/cssnr/toml-action/issues
- Chat with us on Discord: https://discord.gg/wXy6m2X8wY
- Provide General Feedback: [https://cssnr.github.io/feedback/](https://cssnr.github.io/feedback/?app=TOML%20Action)

For more information, see the CSSNR [SUPPORT.md](https://github.com/cssnr/.github/blob/master/.github/SUPPORT.md#support).

# Contributing

If you would like to submit a PR, please review the [CONTRIBUTING.md](#contributing-ov-file).

Please consider making a donation to support the development of this project
and [additional](https://cssnr.com/) open source projects.

[![Ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/cssnr)

[![Actions Tools](https://raw.githubusercontent.com/smashedr/repo-images/refs/heads/master/actions/actions-tools.png)](https://actions-tools.cssnr.com/)

Additionally, you can support other [GitHub Actions](https://actions.cssnr.com/) I have published:

- [Stack Deploy Action](https://github.com/cssnr/stack-deploy-action?tab=readme-ov-file#readme)
- [Portainer Stack Deploy Action](https://github.com/cssnr/portainer-stack-deploy-action?tab=readme-ov-file#readme)
- [Docker Context Action](https://github.com/cssnr/docker-context-action?tab=readme-ov-file#readme)
- [Actions Up Action](https://github.com/cssnr/actions-up-action?tab=readme-ov-file#readme)
- [Zensical Action](https://github.com/cssnr/zensical-action?tab=readme-ov-file#readme)
- [VirusTotal Action](https://github.com/cssnr/virustotal-action?tab=readme-ov-file#readme)
- [Mirror Repository Action](https://github.com/cssnr/mirror-repository-action?tab=readme-ov-file#readme)
- [Update Version Tags Action](https://github.com/cssnr/update-version-tags-action?tab=readme-ov-file#readme)
- [Docker Tags Action](https://github.com/cssnr/docker-tags-action?tab=readme-ov-file#readme)
- [Update JSON Value Action](https://github.com/cssnr/update-json-value-action?tab=readme-ov-file#readme)
- [JSON Key Value Check Action](https://github.com/cssnr/json-key-value-check-action?tab=readme-ov-file#readme)
- [Parse Issue Form Action](https://github.com/cssnr/parse-issue-form-action?tab=readme-ov-file#readme)
- [Cloudflare Purge Cache Action](https://github.com/cssnr/cloudflare-purge-cache-action?tab=readme-ov-file#readme)
- [Mozilla Addon Update Action](https://github.com/cssnr/mozilla-addon-update-action?tab=readme-ov-file#readme)
- [Package Changelog Action](https://github.com/cssnr/package-changelog-action?tab=readme-ov-file#readme)
- [NPM Outdated Check Action](https://github.com/cssnr/npm-outdated-action?tab=readme-ov-file#readme)
- [Label Creator Action](https://github.com/cssnr/label-creator-action?tab=readme-ov-file#readme)
- [Algolia Crawler Action](https://github.com/cssnr/algolia-crawler-action?tab=readme-ov-file#readme)
- [Upload Release Action](https://github.com/cssnr/upload-release-action?tab=readme-ov-file#readme)
- [Check Build Action](https://github.com/cssnr/check-build-action?tab=readme-ov-file#readme)
- [Web Request Action](https://github.com/cssnr/web-request-action?tab=readme-ov-file#readme)
- [Get Commit Action](https://github.com/cssnr/get-commit-action?tab=readme-ov-file#readme)

<details><summary>❔ Unpublished Actions</summary>

These actions are not published on the Marketplace, but may be useful.

- [cssnr/create-files-action](https://github.com/cssnr/create-files-action?tab=readme-ov-file#readme) - Create various files from templates.
- [cssnr/draft-release-action](https://github.com/cssnr/draft-release-action?tab=readme-ov-file#readme) - Keep a draft release ready to publish.
- [cssnr/env-json-action](https://github.com/cssnr/env-json-action?tab=readme-ov-file#readme) - Convert env file to json or vice versa.
- [cssnr/push-artifacts-action](https://github.com/cssnr/push-artifacts-action?tab=readme-ov-file#readme) - Sync files to a remote host with rsync.
- [smashedr/update-release-notes-action](https://github.com/smashedr/update-release-notes-action?tab=readme-ov-file#readme) - Update release notes.
- [smashedr/combine-release-notes-action](https://github.com/smashedr/combine-release-notes-action?tab=readme-ov-file#readme) - Combine release notes.

---

</details>

<details><summary>📝 Template Actions</summary>

These are basic action templates that I use for creating new actions.

- [javascript-action](https://github.com/smashedr/javascript-action?tab=readme-ov-file#readme) - JavaScript
- [typescript-action](https://github.com/smashedr/typescript-action?tab=readme-ov-file#readme) - TypeScript
- [py-test-action](https://github.com/smashedr/py-test-action?tab=readme-ov-file#readme) - Dockerfile Python
- [test-action-uv](https://github.com/smashedr/test-action-uv?tab=readme-ov-file#readme) - Dockerfile Python UV
- [docker-test-action](https://github.com/smashedr/docker-test-action?tab=readme-ov-file#readme) - Docker Image Python

Note: The `docker-test-action` builds, runs and pushes images to [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry).

---

</details>

For a full list of current projects visit: [https://cssnr.github.io/](https://cssnr.github.io/)
