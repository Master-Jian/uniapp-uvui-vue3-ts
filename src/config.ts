export function env(): Env {
  return 'pro'
}

export function baseURL() {
  if (env() == 'dev') {
    return ''
  } else if (env() == 'pro') {
    return ''
  }
}
