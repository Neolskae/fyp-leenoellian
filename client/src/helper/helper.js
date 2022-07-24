//change int to Month
export function intToMonth(int){
    switch(int){
        case 0:
            return 'January'
        case 1:
            return 'February'
        case 2:
            return 'March'
        case 3:
            return 'April'
        case 4:
            return 'May'
        case 5:
            return 'June'
        case 6:
            return 'July'
        case 7:
            return 'August'
        case 8:
            return 'September'
        case 9:
            return 'October'
        case 10:
            return 'November'
        case 11:
            return 'December'
        default :
            return 'error'
    }
}

//Determine logo based on activity type
export function activityTypeLogo(activityType) {
    if (activityType === 'Hangout') {
        return 'https://i.ibb.co/rM73bbG/hangout-logo.png';
    } else if (activityType === 'Sport') {
        return 'https://i.ibb.co/1dkP6HC/sport-logo.png';
    } else if (activityType === 'Study') {
        return 'https://i.ibb.co/x8DdWsF/study-logo.png';
    } else if (activityType === 'Other') {
        return 'https://i.ibb.co/KKvsPV3/other-logo.png';
    } else {
        return ''
    }
}

//Round numbers
export function roundToTwo(num) {
    return +(Math.round(num + "e+2") + "e-2");
}

//Base Url
export const base_url = 'https://fyp-leenoellian.herokuapp.com'

//https://fyp-leenoellian.herokuapp.com     
//http://localhost:3001