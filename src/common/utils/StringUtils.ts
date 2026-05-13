class StringUtils {
    public truncateString(str: string, end: number) {
        return str.length <= end ? str : str.slice(0, end) + '...';
    }

    public parseHashRoutePartToObject(fullHash: string): any {
        const hash = fullHash.substring(1);

        const result = hash.split('&').reduce(function (result: any, item: string) {
            const parts: string[] = item.split('=');
            result[parts[0]] = parts[1];
            return result;
        }, {});
        return result;
    }
}

export default new StringUtils();
