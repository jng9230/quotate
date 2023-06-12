import { Modal } from "./Modal"
import { TextArea } from "./TextArea"
function EditQuoteModal({
    setEditQuoteModal,
    editText,
    setEditText,
    handleTextSave
}:{
    setEditQuoteModal: React.Dispatch<React.SetStateAction<boolean>>,
    editText: string,
    setEditText: React.Dispatch<React.SetStateAction<string>>,
    handleTextSave: (newText: string) => void,
}){
    return (
        <Modal onClick={() => { setEditQuoteModal(false) }}>
            <TextArea heading={"EDIT TEXT"} text={editText} setText={setEditText} handleTextSave={handleTextSave}/>
        </Modal>
    )
}
export {EditQuoteModal}