import * as core from '@actions/core'
import fs from 'node:fs'
import path from 'node:path'
import { JSONPath } from 'jsonpath-plus'
import { parse, stringify } from 'smol-toml'

async function main() {
  const version: string = process.env.GITHUB_ACTION_REF
    ? `\u001b[35;1m${process.env.GITHUB_ACTION_REF}`
    : '\u001b[33;1mSource'
  core.info(`🏳️ Starting TOML Action - ${version}`)

  // Parse Inputs
  const inputs = {
    file: core.getInput('file', { required: true }),
    path: core.getInput('path'),
    value: core.getInput('value'),
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
        value = JSON.parse(JSON.stringify(value))
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

function parseJSONPathSegments(path: string): PathSegment[] {
  let normalized = path
  if (normalized.startsWith('$.')) normalized = normalized.slice(2)
  else if (normalized.startsWith('$')) normalized = normalized.slice(1)

  if (!normalized) return []

  const parts = normalized.split('.')
  const segments: PathSegment[] = []

  for (const part of parts) {
    if (!part) continue

    const bracketIndex = part.indexOf('[')
    const key = bracketIndex >= 0 ? part.slice(0, bracketIndex) : part

    if (key) {
      segments.push({ type: 'key', key })
    }

    if (bracketIndex >= 0) {
      const bracketPart = part.slice(bracketIndex)
      const indexMatches = bracketPart.matchAll(/\[(\d+)\]/g)
      for (const match of indexMatches) {
        segments.push({ type: 'index', index: parseInt(match[1], 10) })
      }
    }
  }

  return segments
}

function createContainer(nextSegment: PathSegment): any {
  if (nextSegment.type === 'index') return []
  return {}
}

function setValueAtPath(obj: any, path: string, value: any, append: boolean) {
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
      }
    } else if (segment.type === 'index') {
      if (isLast) {
        current[segment.index] = value
      } else {
        if (!current[segment.index]) {
          current[segment.index] = createContainer(segments[i + 1])
        }
        current = current[segment.index]
      }
    }
  }
}

try {
  await main()
} catch (e) {
  console.log(e)
  if (e instanceof Error) core.setFailed(e.message)
}
