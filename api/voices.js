// Vercel Serverless Function to get available voices
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const voices = [
    { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Arnold (Deep Male)' },
    { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George (British Male)' },
    { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah (Female)' },
    { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel (Female)' },
    { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam (Male)' },
  ];
  
  res.status(200).json({ voices });
}
