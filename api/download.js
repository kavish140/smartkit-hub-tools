// Vercel Serverless Function for YouTube Video Download
// Uses ytdl-core to fetch video streams
import ytdl from 'ytdl-core';

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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { videoId, quality = 'highest', format = 'mp4' } = req.query;

    if (!videoId) {
      return res.status(400).json({ error: 'videoId is required' });
    }

    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    // Validate video
    if (!ytdl.validateURL(videoUrl)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    // Get video info
    const info = await ytdl.getInfo(videoUrl);
    const title = info.videoDetails.title.replace(/[^a-zA-Z0-9]/g, '_');

    // Set response headers for download
    res.setHeader('Content-Disposition', `attachment; filename="${title}.${format}"`);
    res.setHeader('Content-Type', format === 'mp3' ? 'audio/mpeg' : 'video/mp4');

    // Stream options based on format
    let streamOptions;
    if (format === 'mp3') {
      // Audio only
      streamOptions = {
        quality: 'highestaudio',
        filter: 'audioonly'
      };
    } else {
      // Video with audio
      streamOptions = {
        quality: quality === 'highest' ? 'highest' : quality,
        filter: format === 'mp4' ? 'audioandvideo' : undefined
      };
    }

    // Stream video directly to response
    const stream = ytdl(videoUrl, streamOptions);

    stream.on('error', (err) => {
      console.error('Stream error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to stream video' });
      }
    });

    stream.pipe(res);

  } catch (error) {
    console.error('Download error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Failed to download video',
        message: error.message
      });
    }
  }
}

export const config = {
  api: {
    responseLimit: false, // Disable response limit for video streaming
  },
};

