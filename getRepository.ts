import axios from 'axios'
import config from './config'

export default async () => {
    try {
        const response = await axios.get(
            `${config.GITHUB_API_URL}/user/repos`,
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
