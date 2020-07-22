export function getCLICreate(output: string) {
  return output
    .match(/^CREATE (.+?) \(\d* .*\)$/gm)
    ?.map(i => i.replace(/^CREATE (.+?) \(\d* .*\)$/gm, '$1'))
    .filter(String)
    .map(i => i.trim())
}