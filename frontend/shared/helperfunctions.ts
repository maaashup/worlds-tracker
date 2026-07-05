export const formatDate = (date: string) => {

    const dateObj = new Date(date);

    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('en-GB', { month: 'long' });
    const year = dateObj.getFullYear();

    const rule = new Intl.PluralRules('en-GB', { type: 'ordinal' });

    const suffixes: Record<Intl.LDMLPluralRule, string> = {
        zero: 'th',
        one: 'st',
        two: 'nd',
        few: 'rd',
        many: 'th',
        other: 'th'
    };

    const suffix = suffixes[rule.select(day)];

    return `${day}${suffix} ${month}, ${year}`;
};