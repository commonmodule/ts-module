class StringUtil {
    capitalize(input) {
        const words = input.split(" ");
        const capitalizedWords = words.map((word) => {
            if (word.length === 0)
                return word;
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        });
        return capitalizedWords.join(" ");
    }
}
export default new StringUtil();
//# sourceMappingURL=StringUtil.js.map