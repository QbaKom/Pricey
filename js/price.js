let Price = {
    parse: function(text)
    {
        let result = {
            text: text,
            cleanText: null,
            currencySymbol: null,
            decimalValue: null,
            floatValue: null,
            intValue: null,
            separatorIndices: [],
            separatorCounts: {},
            decimalSeparator: null,
            thousandSeparator: null,
            formattedPrice: function() {
                return Price.formattedPrice(this)
            }
        };

        if (result.text == null)
        {
            return result;
        }

        result.cleanText = result.text
            .replace(/\s/g, "")
            .replace("–", "-")
            .replace(".-", ".00")
            .replace(",-", ",00")
            .replace(/\.0$/, ".00")
            .replace(/,0$/, ",00")
            .match(/[.,0-9]+/);

        if (result.cleanText == null)
        {
            return result;
        }

        result.cleanText = result.cleanText[0].replace(/\s/g, "");

        result.text = result.text.replace(/eur/ig, "\u20AC");
        result.text = result.text.replace(/usd/ig, "$");
        result.text = result.text.replace(/nzd/ig, "$");
        result.text = result.text.replace(/gbp/ig, "\u00A3");

        if (result.text.match(/\u5186/ig))
        {
            result.text = "\u00A5" + result.text.replace(/\u5186/ig, "");
        }

        result.currencySymbol = result.text.match(/[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F\u17DB\u20A0-\u20BD\uA838\uFDFC\uFE69\uFF04\uFFE0\uFFE1\uFFE5\uFFE6]/);

        if (result.currencySymbol != null)
        {
            result.currencySymbol = result.currencySymbol[0];
        }

        let separatorDot = ".";
        let separatorComma = ",";

        result.separatorCounts[separatorDot] = 0;
        result.separatorCounts[separatorComma] = 0;

        for (let i = 0; i < result.cleanText.length; i++)
        {
            if (result.cleanText[i] === separatorDot || result.cleanText[i] === separatorComma)
            {
                result.separatorIndices.push(i);
                result.separatorCounts[result.cleanText[i]] += 1;
            }
        }

        if (result.separatorIndices.length == 0)
        {
            result.intValue = parseInt(result.cleanText);
            result.floatValue = parseFloat(result.cleanText);
            result.decimalValue = result.cleanText + ".00";
        }
        else if (result.separatorIndices.length == 1)
        {
            if ((result.cleanText.length - result.separatorIndices[0] - 1) == 2)
            {
                result.decimalSeparator = result.cleanText[result.separatorIndices[0]];
                result.thousandSeparator = result.decimalSeparator == separatorDot ? separatorComma : separatorDot;

                result.decimalValue = result.cleanText.replace(result.cleanText[result.separatorIndices[0]], ".");
                result.floatValue = parseFloat(result.decimalValue);
                result.intValue = parseInt(result.floatValue);
            }
            else if ((result.cleanText.length - result.separatorIndices[0] - 1) == 3)
            {
                result.thousandSeparator = result.cleanText[result.separatorIndices[0]];
                result.decimalSeparator = result.thousandSeparator == separatorDot ? separatorComma : separatorDot;

                result.decimalValue = result.cleanText.replace(result.cleanText[result.separatorIndices[0]], "") + ".00";
                result.intValue = parseInt(result.decimalValue);
                result.floatValue = parseFloat(result.intValue);
            }
        }
        else
        {
            if (result.separatorCounts[separatorDot] == result.separatorCounts[separatorComma])
            {
                result.decimalSeparator = result.cleanText[result.separatorIndices[result.separatorIndices.length - 1]];
                result.thousandSeparator = result.decimalSeparator == separatorDot ? separatorComma : separatorDot;
            }
            else if (result.separatorCounts[separatorDot] == 1)
            {
                result.decimalSeparator = separatorDot;
                result.thousandSeparator = separatorComma;
            }
            else if (result.separatorCounts[separatorComma] == 1)
            {
                result.decimalSeparator = separatorComma;
                result.thousandSeparator = separatorDot;
            }
            else if (result.separatorCounts[separatorDot] == 0)
            {
                result.decimalSeparator = separatorDot;
                result.thousandSeparator = separatorComma;
            }
            else if (result.separatorCounts[separatorComma] == 0)
            {
                result.decimalSeparator = separatorComma;
                result.thousandSeparator = separatorDot;
            }

            let thousandSeparatorRegex = new RegExp(result.thousandSeparator.replace(".", "\\."), "g");
            result.decimalValue = result.cleanText.replace(thousandSeparatorRegex, "").replace(result.decimalSeparator, ".");

            if (result.decimalValue.indexOf(".") === -1)
            {
                result.decimalValue += ".00";
            }

            result.floatValue = parseFloat(result.decimalValue);
            result.intValue = parseInt(result.floatValue);
        }

        return result;
    },
    getPriceInCents: function(price)
    {
        if (price == null || price.decimalValue == null)
        {
            return null;
        }

        return parseInt(price.decimalValue.replace(".", ""));
    },
    difference: function(priceOld, priceNew)
    {
        let result = {
            text: null,
            cleanText: null,
            currencySymbol: null,
            decimalValue: null,
            floatValue: null,
            intValue: null,
            separatorIndices: [],
            separatorCounts: {},
            decimalSeparator: null,
            thousandSeparator: null,
            formattedPrice: function(showSign = false) {
                if (this.decimalValue == null)
                {
                    return "";
                }

                let result = Intl.NumberFormat().format(this.decimalValue).replace(/\.00$/, "");

                if (!this.decimalValue.endsWith(".00") && this.decimalValue.endsWith("0"))
                {
                    result += "0";
                }

                if (result.startsWith("-"))
                {
                    result = result.substr(1);
                }

                result = (this.currencySymbol ?? "") + result;

                if (showSign)
                {
                    if (this.floatValue >= 0.0)
                    {
                        result = "+" + result;
                    }
                    else
                    {
                        result = "-" + result;
                    }

                }

                return result;
            }
        };

        if (priceNew === null || priceOld === null || priceNew.floatValue === null || priceOld.floatValue === null)
        {
            return result;
        }

        result.currencySymbol = priceOld.currencySymbol ?? priceNew.currencySymbol;
        result.floatValue = priceNew.floatValue - priceOld.floatValue;
        result.decimalValue = result.floatValue.toFixed(2);

        return result;
    },
    differencePercentage: function(priceOld, priceNew)
    {
        let priceOldCents = this.getPriceInCents(priceOld);
        let priceNewCents = this.getPriceInCents(priceNew);

        if (priceOldCents == null || priceNewCents == null)
        {
            return "0%";
        }

        let difference = priceNewCents - priceOldCents;

        if (priceOldCents == 0)
        {
            return "0%";
        }

        let result = difference / priceOldCents * 100;

        if (Math.abs(result) < 10.0)
        {
            result = result.toFixed(1);
        }
        else
        {
            result = parseInt(result);
        }

        if (result >= 0.0)
        {
            return "+" + result + "%";
        }

        return result + "%";
    },
    formattedPrice: function(price)
    {
        if (price === null || price.decimalValue === null)
        {
            return "";
        }

        let result = Intl.NumberFormat().format(price.decimalValue).replace(/\.00$/, "");

        // ?
        if (!price.decimalValue.endsWith(".00") && price.decimalValue.endsWith("0"))
        {
            result += "0";
        }
        /*
        if (this.decimalValue != null)
        {
            let startIndex = this.decimalValue.indexOf(".") - 1;

            if (startIndex === -2)
            {
                startIndex = result.length - 1;
            }

            let thousandSeparatorCount = 0;

            for (let i = startIndex; i >= 0; i--)
            {
                if ((thousandSeparatorCount % 3) === 0)
                {
                    result += ".";
                }

                result += this.decimalValue[i];

                thousandSeparatorCount++;
            }

            result = [...result].reverse().join("");

            result = result.replace(/\.$/, "");
        }*/

        return (price.currencySymbol ?? "") + (result ?? "");
    }
};

/*
console.log(Price.parse("10.990"));
console.log(Price.parse("1000.01")); // 1000.01
console.log(Price.parse("1,000.10")); // 1000.1
console.log(Price.parse("1.000,25")); // 1000250
console.log(Price.parse("1.000.000,31")); // 1000000.31
console.log(Price.parse("1,000,000.29")); // 1000000.29
console.log(Price.parse("1,000,000")); // 1000000
console.log(Price.parse("1000000")); // 1000000

console.log(Price.parse("100.100,61"));
console.log(Price.parse("1.234,05"));
console.log(Price.parse("19.232,12"));
console.log(Price.parse("21,09"));
console.log(Price.parse("234.892,56"));
console.log(Price.parse("27.490,-"));

console.log(Price.parse("Y234,892,560"));
console.log(Price.parse("$ 234,892,560. 99"));
console.log(Price.parse("234,892,560. 99 $"));
console.log(Price.parse("E 23,-")); // TODO: not handled correctly

console.log(Price.differencePercentage(Price.parse("$1,000.01"), Price.parse("$ 1001,05")));
console.log(Price.differencePercentage(Price.parse("$ 1,001. 05"), Price.parse("$1000, 01")));
console.log(Price.differencePercentage(Price.parse("1,000.01"), Price.parse("2001,05")));
console.log(Price.differencePercentage(Price.parse("2001,05"), Price.parse("1,000.01")));

console.log(Price.differencePercentage(Price.parse("139,00 €"), Price.parse("39,90 €")));
console.log(Price.difference(Price.parse("€3000.00"), Price.parse("€2000.00")).formattedPrice(true));
*/