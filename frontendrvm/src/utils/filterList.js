
export function filterList (list, option) {
    if (option === 'All')
        return list

    return list.filter(item => item.genres.some(value => value.name === option))
}