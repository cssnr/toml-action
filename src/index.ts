import * as core from '@actions/core'
import fs from 'node:fs'
import path from 'node:path'
import { JSONPath } from 'jsonpath-plus'
import { parse, stringify } from 'smol-toml'

async function main() {
    const version = process.env.GITHUB_ACTION_REF
        ? `\u001b[35;1m${process.env.GITHUB_ACTION_REF}`
        : '\u001b[33;1mSource'
    core.info(`🏳️ Starting TOML Action - ${version}`)

    // Parse Inputs
    const inputs = {
        file: core.getInput('file', { required: true }),
        path: core.getInput('path', { required: true }),
        value: core.getInput('value'),
        write: core.getBooleanInput('write'),
        output: core.getInput('output'),
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
    console.log(data)
    core.endGroup() // Data

    // Parse Value from Data
    const values = JSONPath({ path: inputs.path, json: data })
    console.log('values:', values)
    if (!values.length) {
        return core.setFailed(`No Values for Path: ${inputs.path}`)
    }
    const value = values[0]
    core.info(`➡️ Parsed Value: \u001b[36;1m${value}`)
    core.info(`value type: \u001b[33;1m${typeof value}`)

    // Set Value on Data
    if (inputs.value) {
        const parsed = parseValue(inputs.value)
        core.info(`📝 Updating Value: \u001b[36;1m${parsed}`)
        core.info(`value type: \u001b[33;1m${typeof parsed}`)
        setJSONPath(data, inputs.path, inputs.value)
        core.startGroup('Updated Data')
        console.log(data)
        core.endGroup() // Updated Data
    }

    // Parse TOML from Updated Data
    const toml = stringify(data)
    core.startGroup('TOML')
    console.log(toml)
    core.endGroup() // TOML

    if (inputs.write && (inputs.value || inputs.output)) {
        const file = inputs.output || inputs.file
        const dir = path.dirname(file)
        if (!fs.existsSync(dir)) {
            core.info(`📁 Creating Directory: \u001b[34;1m${dir}`)
            fs.mkdirSync(dir, { recursive: true })
        }
        core.info(`💾 Writing to File: \u001b[32;1m${file}`)
        fs.writeFileSync(file, toml)
    }

    // Set Outputs
    core.info('📩 Setting Outputs')
    core.setOutput('value', value)
    core.setOutput('data', data)
    core.setOutput('toml', toml)

    core.info(`✅ \u001b[32;1mFinished Success`)
}

function parseValue(value: string): string | number | boolean | null {
    try {
        const parsed = JSON.parse(value)
        if (
            typeof parsed === 'string' ||
            typeof parsed === 'number' ||
            typeof parsed === 'boolean' ||
            parsed === null
        ) {
            return parsed
        }
        return value
    } catch {
        return value
    }
}

function setJSONPath(obj: any, path: string, value: any) {
    const pointers = JSONPath({ path, json: obj, resultType: 'pointer' })
    for (const pointer of pointers) {
        let target = obj
        const parts = pointer.slice(1).split('/')
        for (let i = 0; i < parts.length - 1; i++) target = target[parts[i]]
        target[parts[parts.length - 1]] = value
    }
}

try {
    await main()
} catch (e) {
    console.log(e)
    if (e instanceof Error) core.setFailed(e.message)
}
