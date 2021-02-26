import axios from 'axios'
import config from './config'

const getgetRepositories = async () => {
    try {
        const response = await axios.get(
            `${config.GITHUB_API_URL}/user/repos`,
            {
                params: {
                    type: ''
                },
                headers: {
                    Authorization: `token ${config.PERSONAL_ACCESS_TOKEN}`
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

getgetRepositories()
    .then(result => console.log(result))
    .catch(err => console.log(err))
