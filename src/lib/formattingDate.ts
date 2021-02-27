export default (date: string) => {
    return new Date(date).toISOString().substr(0, 10).replace(/-/g, '.')
}