import * as core from '@actions/core'
import fs from 'node:fs'
import path from 'node:path'
import { JSONPath } from 'jsonpath-plus'
import { parse, stringify } from 'smol-toml'

async function main() /* NOSONAR */ {
  const version: string = process.env.GITHUB_ACTION_REF
    ? `\u001b[35;1m${process.env.GITHUB_ACTION_REF}`
    : '\u001b[33;1mSource'
  core.info(`🏳️ Starting TOML Action - ${version}`)

  // Parse Inputs
  const inputs = {
    file: core.getInput('file', { required: true }),
    path: core.getInput('path'),
    value: core.getInput('value', { trimWhitespace: false }),
    write: core.getBooleanInput('write'),
    output: core.getInput('output'),
    append: core.getBooleanInput('append'),
  } as const
  core.startGroup('Inputs')
  console.log(inputs)
  core.endGroup() // Inputs

  // Get Data from File
  core.info(`📄 Processing File: \u001b[36;1m${inputs.file}`)
  if (!fs.existsSync(inputs.file)) {
    return core.setFailed(`File Not Found: ${inputs.file}`)
  }
  const fileData: Buffer = fs.readFileSync(inputs.file)
  const data = parse(fileData.toString())
  core.startGroup('Data')
  core.info(JSON.stringify(data, null, 2))
  core.endGroup() // Data

  // Parse Value from Path (graceful when also setting)
  let value: any = ''
  if (inputs.path) {
    try {
      value = parseJSONPath(inputs.path, data)
      // Deep clone to prevent mutation by setValueAtPath below
      if (typeof value === 'object') {
        value = structuredClone(value)
      }
    } catch (e) {
      if (!inputs.value) throw e
    }
  }
  core.info(`➡️ Parsed Value: \u001b[36;1m${value}`)
  core.info(`    type: \u001b[33;1m${typeof value}`)

  // Set Value on Data
  if (inputs.path && inputs.value) {
    const parsed = parseValue(inputs.value)
    core.info(`📝 Updating Value: \u001b[36;1m${parsed}`)
    core.info(`    type: \u001b[33;1m${typeof parsed}`)
    setValueAtPath(data, inputs.path, parsed, inputs.append)
    core.startGroup('Updated Data')
    core.info(JSON.stringify(data, null, 2))
    core.endGroup() // Updated Data
  }

  // Parse TOML from Updated Data
  const toml = stringify(data)
  core.startGroup('TOML')
  core.info(toml)
  core.endGroup() // TOML

  if (inputs.write && (inputs.value || inputs.output)) {
    const file = inputs.output || inputs.file
    const dir = path.dirname(file)
    if (!fs.existsSync(dir)) {
      core.info(`📁 Creating Directory: \u001b[34;1m${dir}`)
      fs.mkdirSync(dir, { recursive: true })
    }
    core.info(`💾 Writing to File: \u001b[33;1m${file}`)
    fs.writeFileSync(file, toml)
  }

  // Set Outputs
  core.info('📩 Setting Outputs')
  core.setOutput('value', value)
  core.setOutput('data', data)
  core.setOutput('toml', toml)

  core.info(`✅ \u001b[32;1mFinished Success`)
}

function parseJSONPath(value: string, data: object) {
  if (!value) return ''
  const values = JSONPath({ path: value, json: data })
  console.log('parsed values:', values)
  if (!values.length) {
    throw new Error(`No Values for Path: ${value}`)
  }
  return values[0]
}

function parseValue(value: string): string | number | boolean {
  try {
    const parsed = JSON.parse(value)
    if (typeof parsed === 'object') return value
    return parsed
  } catch {
    return value
  }
}

type PathSegment = { type: 'key'; key: string } | { type: 'index'; index: number }

function parseJSONPathSegments(path: string): PathSegment[] /* NOSONAR */ {
  let s = path
  if (s.startsWith('$.')) s = s.slice(2)
  else if (s.startsWith('$')) s = s.slice(1)
  if (!s) return []
  // $..name leaves a leading dot after stripping the root ($.) — recursive
  // descent is query syntax, not a creatable path
  if (s.startsWith('.')) {
    throw new Error(`Recursive descent is not supported for creating a path: ${path}`)
  }

  const segments: PathSegment[] = []
  let i = 0

  while (i < s.length) {
    if (s[i] === '.') {
      // Recursive descent ($..) is query syntax, not a creatable path
      if (s[i + 1] === '.') {
        throw new Error(`Recursive descent is not supported for creating a path: ${path}`)
      }
      i++
      continue
    }

    if (s[i] === '[') {
      if (s[i + 1] === "'" || s[i + 1] === '"') {
        const quote = s[i + 1]
        let key = ''
        i += 2
        let closed = false
        while (i < s.length && s[i] !== quote) {
          if (s[i] === '\\' && i + 1 < s.length) {
            key += s[i + 1]
            i += 2
            continue
          }
          key += s[i]
          i++
        }
        if (i < s.length && s[i] === quote) {
          i++
          if (s[i] === ']') {
            i++
            closed = true
          }
        }
        if (!closed) {
          throw new Error(`Invalid quoted key in path: ${path}`)
        }
        segments.push({ type: 'key', key })
      } else {
        let num = ''
        i++
        while (i < s.length && s[i] >= '0' && s[i] <= '9') {
          num += s[i]
          i++
        }
        // Filters [?()], wildcards [*], slices [0:2], unions [0,1], and
        // malformed brackets are query syntax, not creatable array indices
        if (num === '' || s[i] !== ']') {
          throw new Error(
            `Unsupported array access in path (creating requires a plain index like [0]): ${path}`,
          )
        }
        i++
        segments.push({ type: 'index', index: Number.parseInt(num, 10) })
      }
      continue
    }

    let key = ''
    while (i < s.length && s[i] !== '.' && s[i] !== '[') {
      const c = s[i]
      // TOML v1.1.0 bare keys may only contain ASCII letters, ASCII digits,
      // underscores, and dashes (A-Za-z0-9_-). The ~ and / characters are also
      // accepted here to mirror jsonpath-plus bare-path parsing (jsonpath-plus
      // resolves $.a/b to the key "a/b"); smol-toml quotes any key containing
      // them when stringifying. Any other character is JSONPath query syntax
      // that cannot be turned into a key
      if (!/^[A-Za-z0-9_\-~/]$/.test(c)) {
        throw new Error(
          `Unsupported character '${c}' in path when creating a path: ${path}`,
        )
      }
      key += c
      i++
    }
    segments.push({ type: 'key', key })
  }

  return segments
}

function createContainer(nextSegment: PathSegment): any {
  if (nextSegment.type === 'index') return []
  return {}
}

function guardContainer(value: any, what: string): void {
  if (value === null || typeof value !== 'object') {
    throw new Error(
      `Cannot create a nested path under ${what}: existing value is not a table or array`,
    )
  }
}

function setValueAtPath /* NOSONAR */(
  obj: any,
  path: string,
  value: any,
  append: boolean,
) {
  // Try jsonpath-plus first for existing paths (full JSONPath syntax support)
  const pointers = JSONPath({ path, json: obj, resultType: 'pointer' })

  if (pointers.length > 0) {
    for (const pointer of pointers) {
      // Root match ("$" resolves to pointer ""): this action edits existing
      // keys in a TOML file, it does not replace the whole document — fail
      // clearly instead of silently writing a stray obj[''] entry.
      if (pointer === '') {
        throw new Error(`Cannot set a value at the document root: ${path}`)
      }

      let target = obj
      const parts = pointer.slice(1).split('/')
      for (let i = 0; i < parts.length - 1; i++)
        target = target[parts[i].replaceAll('~1', '/').replaceAll('~0', '~')]
      const lastKey = parts[parts.length - 1].replaceAll('~1', '/').replaceAll('~0', '~')

      if (append && Array.isArray(target[lastKey])) {
        target[lastKey].push(value)
      } else if (append) {
        target[lastKey] = [target[lastKey], value]
      } else {
        target[lastKey] = value
      }
    }
    return
  }

  // Path doesn't exist — create intermediate structure
  const segments = parseJSONPathSegments(path)
  if (!segments.length) throw new Error(`Invalid Path: ${path}`)

  let current = obj
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    const isLast = i === segments.length - 1

    if (segment.type === 'key') {
      if (isLast) {
        if (append) {
          if (!(segment.key in current)) {
            current[segment.key] = [value]
          } else if (Array.isArray(current[segment.key])) {
            current[segment.key].push(value)
          } else {
            current[segment.key] = [current[segment.key], value]
          }
        } else {
          current[segment.key] = value
        }
      } else {
        if (!(segment.key in current)) {
          current[segment.key] = createContainer(segments[i + 1])
        }
        current = current[segment.key]
        guardContainer(current, `key '${segment.key}'`)
      }
    } else if (segment.type === 'index') {
      if (isLast) {
        current[segment.index] = value
      } else {
        if (!(segment.index in current)) {
          current[segment.index] = createContainer(segments[i + 1])
        }
        current = current[segment.index]
        guardContainer(current, `index ${segment.index}`)
      }
    }
  }
}

try {
  await main()
} catch (e) {
  console.log(e)
  core.setFailed(e instanceof Error ? e.message : String(e))
}
