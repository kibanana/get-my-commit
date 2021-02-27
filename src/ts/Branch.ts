export default interface Branch {
    name: string;
    commit: {
        sha: string;
        url: string;
    };
    protected: boolean;
    protection: {
        enabled: boolean;
        required_status_checks: [Object];
    };
    protection_url: string;
}