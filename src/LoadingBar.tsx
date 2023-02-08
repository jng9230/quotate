function LoadingBar(percent:number) {
    const styles = {
        width: (percent*100).toString() + "%"
    }
    return (
        <div className="max-w-xs bg-gray-200 rounded-full h-4 dark:bg-gray-700 m-3">
            <div id="bar" className="bg-purple-500 h-4 rounded-full"
                style={styles}>
            </div>
        </div>
    )
}
export {LoadingBar}