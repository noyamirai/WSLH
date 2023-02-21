// SOURCE: somewhere from the depths of stackoverflow
export function getCurrentDate (apiFormat = false) {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    if (apiFormat) {
        return yyyy + '-' + mm + '-' + dd;
    }

    const formattedToday = dd + '/' + mm + '/' + yyyy;
    return formattedToday;
}

export function formatDate(dateString) {

    let datePart = dateString.match(/\d+/g),
    year = datePart[0].substring(2), // get only two digits
    month = datePart[1], day = datePart[2];

    const formattedDate = day+'/'+month+'/'+year;

    return formattedDate

}