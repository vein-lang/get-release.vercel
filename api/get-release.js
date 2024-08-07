const fetch = require('node-fetch');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const apiUrl = (owner, repo) => `https://api.github.com/repos/${owner}/${repo}/releases/latest`;

module.exports = async (req, res) => {
    const { owner, repo } = req.query;

    if (!owner || !repo) {
        return res.status(400).json({ error: 'Missing required parameters: owner and repo' });
    }

    try {
        const response = await fetch(apiUrl(owner, repo), {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                'User-Agent': 'Vercel-Function'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`GitHub API error: ${response.status} - ${errorData.message}`);
        }

        const releaseInfo = await response.json();
        res.status(200).json(releaseInfo);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Something went wrong' });
    }
};
