export default interface User {
    login: string;
    id: number;
    avatar_url: string;
    url: string;
    name: string;
    bio: string;
    public_repos: number;
    total_private_repos: number;
    created_at: string;
    updated_at: string;
}