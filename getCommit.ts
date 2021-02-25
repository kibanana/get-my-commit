import axios from 'axios'
import config from './config'

const getCommits = async () => {
    try {
        const response = await axios.get(
            `${config.GITHUB_API_URL}/search/commits`,
            {
                params: {
                    q: 'q',
                    mediaType: {
                        previews: [
                          'cloak'
                        ]
                    }
                },
                headers: {
                    'Accept': 'application/vnd.github.cloak-preview+json'
                }
            }
        )
    
        if (response && response.data) {
            return response.data
        }
    } catch (err) {
        console.log(err)
    }
}

getCommits()
    .then(result => console.log(result))
    .catch(err => console.log(err))
