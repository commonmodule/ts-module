class StringUtils {
    capitalize(input) {
        const words = input.split(" ");
        const capitalizedWords = words.map((word) => {
            if (word.length === 0)
                return word;
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        });
        return capitalizedWords.join(" ");
    }
    isKebabCase(str) {
        return /^[a-z]+(-[a-z]+)*$/.test(str);
    }
    formatNumberWithCommas(value, decimals) {
        if (decimals === undefined || +(+value) > Number.MAX_SAFE_INTEGER) {
            const parts = value.split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return parts[1] === "0" ? parts[0] : parts.join(".");
        }
        else {
            const parts = String(+(+value).toFixed(decimals)).split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return parts.join(".");
        }
    }
}
export default new StringUtils();
//# sourceMappingURL=StringUtils.js.map