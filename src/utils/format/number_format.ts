export function formatNumber(num: number): string {
    var formattedNumber = num.toLocaleString('en-US', {
        // add suffixes for thousands, millions, and billions
        // the maximum number of decimal places to use
        maximumFractionDigits: 2,
        notation: "compact",
        compactDisplay: "short"
    });

    return formattedNumber;
}