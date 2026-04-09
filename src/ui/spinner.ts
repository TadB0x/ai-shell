import ora, { type Ora } from 'ora'

export function createSpinner(text: string): Ora {
  return ora({ text, color: 'cyan', spinner: 'dots' })
}

export async function withSpinner<T>(text: string, fn: () => Promise<T>): Promise<T> {
  const spinner = createSpinner(text).start()
  try {
    const result = await fn()
    spinner.stop()
    return result
  } catch (err) {
    spinner.fail()
    throw err
  }
}
