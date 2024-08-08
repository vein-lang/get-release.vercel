const https = require('https');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const apiUrl = '/repos/vein-lang/vein/releases';

module.exports = async (req, res) => {
    const options = {
        hostname: 'api.github.com',
        path: apiUrl,
        method: 'GET',
        headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            'User-Agent': 'Vercel-Function', 
            Accept: 'application/vnd.github.v3+json'
        }
    };

    const request = https.request(options, (response) => {
        let data = '';
        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            if (response.statusCode === 200) {
                try {
                    const releases = JSON.parse(data);
                    const latestRelease = releases[0];
                    res.status(200).json(latestRelease);
                } catch (error) {
                    res.status(500).json({ error: 'Failed to parse response from GitHub API' });
                }
            } else {
                res.status(response.statusCode).json({ error: `GitHub API error: ${response.statusCode} - ${data}` });
            }
        });
    });
    request.on('error', (error) => {
        res.status(500).json({ error: error.message || 'Something went wrong' });
    });
    request.end();
};
