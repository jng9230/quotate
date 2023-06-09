import { QuoteBlock } from "./QuoteBlock"
function QuoteBlocks({
    quotes,
    deleteText
}: {
    quotes: { id: string, text: string }[],
    deleteText: (i: string) => void
}){
    return (
        // <div className="overflow-scroll max-h-full space-y-4 p-3">
        //     {quotes.map((d, i) => {
        //         return (
        //             <QuoteBlock text={d} deleteText={deleteText}></QuoteBlock>
        //         )
        //     })}
        // </div>
        <></>
    )
}
export {QuoteBlocks}