function formatDate (date) {
    const jdate = new Date(date)
    return `${jdate.getDate()}/${jdate.getMonth()+1}/${jdate.getFullYear()}`
}

export default formatDate