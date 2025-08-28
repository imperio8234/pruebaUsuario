export default async function handler(req, res) {
  const targetUrl = `http://46.202.88.87:8010${req.url.replace('/api/proxy', '')}`;

  const response = await fetch(targetUrl, {
    method: req.method,
    headers: {
      ...req.headers,
      host: '46.202.88.87'
    },
    body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined
  });

  res.status(response.status);
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  const data = await response.arrayBuffer();
  res.send(Buffer.from(data));
}
