import axios from 'axios'
import config from './config'

const getCommits = async () => {
    try {
        const response = await axios.get(
            `${config.GITHUB_API_URL}/repos/${config.TEMP_USER}/${config.TEMP_REPO}/commits`,
            {
                params: {
                    sort: 'created-+1',
                    per_page: 100,
                    page: 0
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
