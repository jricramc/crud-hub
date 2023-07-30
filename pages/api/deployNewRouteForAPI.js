import unfetch from 'unfetch';

const handler = async (req, res) => {
  const { method, body, headers } = req;
  const url = '/api/deployNewRouteForAPI-copy';
  const result = await unfetch(url, {
      method: 'POST',
      body,
      headers: {
      'Content-Type': 'application/json',
      },
  });
  if (result.status === 200) {
      res.status(200).send('success');
  }
  res.status(500).send('fail');
};

export default handler;
