export function unsFormat(satoVal: string, currency?: string): string | void {
    if (satoVal?.length) {
        let fractionnal: string = satoVal.substr(-Math.min(satoVal.length, 8));
        const integer = Number(satoVal.substr(0, satoVal.length - 8));
        let normalizedString: string;
        let normalizedFloat: number;
        let scale: string = "";
        let tild = false;
        if (integer === 0) {
            if (Number(fractionnal) === 0) {
                normalizedString = "0";
            } else {
                normalizedString = "<1";
            }
        } else {
            if (integer >= 1e6) {
                normalizedFloat = Number(integer / 1e6);
                fractionnal = String(normalizedFloat).split(".")[1];
                scale = "M";
            } else if (integer >= 1e3) {
                normalizedFloat = Number(integer / 1e3);
                fractionnal = String(normalizedFloat).split(".")[1];
                scale = "k";
            } else {
                normalizedFloat = integer + Number(`0.${fractionnal}`);
            }
            let nbFractionNumbers: number = 0;
            // remove trailing zeros
            fractionnal = fractionnal?.replace(/0+$/, "");
            if (fractionnal?.length) {
                if (fractionnal.length <= 2) {
                    nbFractionNumbers = fractionnal.length;
                } else {
                    nbFractionNumbers = 1;
                    tild = true;
                }
            }

            normalizedString = `${normalizedFloat.toLocaleString(undefined, {
                maximumFractionDigits: nbFractionNumbers,
            })}${tild ? "~" : ""}${scale}`;
        }
        return currency ? `${normalizedString} ${currency}` : normalizedString;
    }
}
