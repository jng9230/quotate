function StorageBox({ storedText }: { storedText: string[]}){
// function StorageBox(){
    // const stored_text = ["penispenispenispenis penispenispenis penis", "asadas asd asd asd sad as ad"]
    return (
        <div className="p-3 bg-purple-500">
            {storedText.map((d, i) => {
                return <p key={i}> {d} </p>
            })}
        </div>
    )
}

export {StorageBox}