export default function wrapRequest(fnc, onSuccess = () => { }, onError = () => { }) {
    fnc.then(data => {
        if (!data.isError) {
            return onSuccess(data)
        }
        onError(data)
    }).catch(error => {
        onError(error)
    })
}