import axios from 'axios'
import config from './config'

const getOrganizations = async () => {
    try {
        const response = await axios.get(
            `${config.GITHUB_API_URL}/user/orgs`,
            {
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

getOrganizations()
    .then(result => console.log(result))
    .catch(err => console.log(err))