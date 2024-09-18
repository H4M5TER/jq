import { Context, Schema } from 'koishi'
import { compile, formats } from './jq'

export const name = 'jq'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  ctx.command('jq <json> <expr:text>')
    .action(({ session }, json: string, expr: string) => {
      const object = (() => { try { return JSON.parse(json) } catch (e) {} })()
      if (!object) return 'Invalid JSON.'
      const filter = compile(expr)
      const result: Generator = filter(object)
      return [...result].map(formats.text).join('\n')
    })
}
