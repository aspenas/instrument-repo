const USERNAME = 'candlefish'
const PASSWORD = 'c@ndlefish'

function unauthorized() {
  return new Response('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Candlefish Internal"',
    },
  })
}

function isAuthorized(request) {
  const auth = request.headers.get('Authorization')
  if (!auth || !auth.startsWith('Basic ')) {
    return false
  }

  const decoded = atob(auth.slice(6))
  const [user, pass] = decoded.split(':')
  return user === USERNAME && pass === PASSWORD
}

async function serveAsset(request, env) {
  const response = await env.ASSETS.fetch(request)

  if (response.status !== 404) {
    return response
  }

  const url = new URL(request.url)
  const wantsHtml =
    request.headers.get('Accept')?.includes('text/html') &&
    !url.pathname.includes('.')

  if (!wantsHtml) {
    return response
  }

  return env.ASSETS.fetch(new Request(new URL('/index.html', request.url), request))
}

export default {
  async fetch(request, env) {
    if (!isAuthorized(request)) {
      return unauthorized()
    }

    const assetResponse = await serveAsset(request, env)
    const headers = new Headers(assetResponse.headers)
    headers.set('Cache-Control', 'no-store')

    return new Response(assetResponse.body, {
      status: assetResponse.status,
      statusText: assetResponse.statusText,
      headers,
    })
  },
}
