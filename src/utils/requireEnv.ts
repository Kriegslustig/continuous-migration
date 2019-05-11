const requireEnv = (name: string): string => {
  const value = process.env[name]
  if (!value) throw new Error(`Environment variable "${name}" must be defined`)
  return value
}

export default requireEnv
