function LoadingBar(percent:number) {
    const styles = {
        width: (percent*100).toString() + "%"
    }
    return (
        <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
            <div id="bar" className="bg-main-green h-4 rounded-full"
                style={styles}>
            </div>
        </div>
    )
}
export {LoadingBar}