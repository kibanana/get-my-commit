import axios from 'axios'
import config from './config'

const getProfile = async () => {
    try {
        const response = await axios.get(
            `${config.GITHUB_API_URL}/user`,
            {
                auth: {
                    username: 'woni-d',
                    password: config.PERSONAL_ACCESS_TOKEN
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

getProfile()
    .then(result => console.log(result))
    .catch(err => console.log(err))
