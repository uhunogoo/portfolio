export default function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=86400');
}