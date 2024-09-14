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
}
export default new StringUtils();
//# sourceMappingURL=StringUtils.js.map