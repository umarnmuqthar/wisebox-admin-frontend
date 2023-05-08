import './metaOptions.scss'
import { useState, useEffect} from 'react'
import PropTypes from 'prop-types'

const MetaOptions = ({ label, setMetaState, metaState }) => {
    const [ metaType, setMetaType ] = useState(metaState.metaType || "")
    const [ list, setMetaList ] = useState(metaState.list || { listType: "a", items: [""]})
    const [ table, setMetaTable ] = useState(metaState.table || { header: [], rows: [[]]})
    const [ imageData, setImageData ] = useState(metaState.image || "") 
    const [ previewImage, setPreviewImage ] = useState(metaState.imageUrl || "") 

    const [ tableHeaderShown, setTableHeaderShown ] = useState(true)

    const type = label.split(" ").join("-").toLowerCase()

    const _onchange = (e) => {
        setMetaType(e.target.value)
    }
    const _addMetaListItem = () => {
        setMetaList({ ...list, items: [ ...list.items, ""]})
    }
    const _removeMetaListItem = (idx) => {
        let newQuestionMetaList = [...list.items];
        newQuestionMetaList.splice(idx, 1);
        setMetaList({ ...list, items: newQuestionMetaList})
    }
    const _handleChangeMetaList = (idx, e) => {
        let newQuestionMetaList = [...list.items];
        newQuestionMetaList[idx] = e.target.value;
        setMetaList({ ...list, items: newQuestionMetaList})
    }

    const _addMetaTableRow = () => {
        setMetaTable({ ...table, rows: [...table.rows, []] })
    }
    const _removeMetaTableRow = (idx) => {
        let newQuestionMetaTableRow = [...table.rows];
        newQuestionMetaTableRow.splice(idx, 1);
        setMetaTable({ ...table, rows: newQuestionMetaTableRow})
    }
    const _handleChangeMetaTable = (idx, col, e) => {
        let newQuestionMetaTableRow = [...table.rows];
        newQuestionMetaTableRow[idx][col] = e.target.value;
        setMetaTable({ ...table, rows: newQuestionMetaTableRow})
    }
    const _handleChangeTableHeader = (idx, e) => {
        let newQuestionMetaTableHeader = [...table.header];
        newQuestionMetaTableHeader[idx] = e.target.value;
        setMetaTable({ ...table, header: newQuestionMetaTableHeader})
    }

    const _handleFileChange = (e) => {
        setImageData(e.target.files[0])
        setPreviewImage(e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : "")
    }

    useEffect(() => {
        let metaData
        switch(metaType) {
            case "list":
                metaData = list
                break
            case "table":
                metaData = table
                break
            case "image":
                metaData = imageData
                break
            default:
                metaData = null
        }

        setMetaState({
            metaType,
            [metaType]: metaData
        })
    }, [list, table, imageData, metaType])

    return (
        <div>
            <label htmlFor="metaQ">{label}</label>
            <div className="d-flex mb-2 mt-2" id="metaQ" onChange={_onchange}>
                <div className="form-check me-3">
                    <input className="form-check-input" 
                        value="" type="radio" name={type} id={`${type}-none`} 
                        defaultChecked={metaType === ""}
                        />
                    <label className="form-check-label" htmlFor={`${type}-none`}>
                        None
                    </label>
                </div>
                <div className="form-check me-3">
                    <input className="form-check-input" 
                        value="list" type="radio"  name={type} id={`${type}-list`}
                        defaultChecked={metaType === "list"}/>
                    <label className="form-check-label" htmlFor={`${type}-list`}>
                        List
                    </label>
                </div>
                <div className="form-check me-3">
                    <input className="form-check-input" 
                        value="image" type="radio" name={type} id={`${type}-image`}
                        defaultChecked={metaType === "image"}/>
                    <label className="form-check-label" htmlFor={`${type}-image`}>
                        Image
                    </label>
                </div>
                <div className="form-check me-3">
                    <input className="form-check-input" 
                        value="table" type="radio" name={type} id={`${type}-table`}
                        defaultChecked={metaType === "table"}/>
                    <label className="form-check-label" htmlFor={`${type}-table`}>
                        Table
                    </label>
                </div>
            </div>

            {metaType === "image" &&
                <div className="mb-4">
                    <div className="input-group mb-3">
                        <input type="file" 
                            accept="image/*"
                            onChange={_handleFileChange}
                            className="form-control" 
                            id="inputGroupFile02"/>
                        {/* <label className="input-group-text" for="inputGroupFile02"></label> */}
                    </div>
                    {previewImage && 
                        <div className="meta-image-container">
                            <img src={previewImage} 
                                name={`${type}-img`}
                                className="rounded mx-auto d-block" 
                                alt="metaImage"/>
                        </div>
                    }
                </div>
            }
            {metaType === "list" && (
                <div className="mb-4">
                    <div className="form-floating mb-2">
                        <select 
                            className="form-select" 
                            id={`${type}-list-type`} 
                            aria-label={`${type}-list-type`}
                            onChange={(e) => setMetaList({ ...list, listType: e.target.value })}
                        >
                            <option value="a" defaultValue>a</option>
                            <option value="A">A</option>
                            <option value="1">1</option>
                            <option value="i">i</option>
                            <option value="I">II</option>
                        </select>
                        <label htmlFor={`${type}-list-type`}>List Type</label>
                    </div>

                    <div id="metalist-container">
                        { list?.items.map((element, idx) => (
                            <div key={idx} className="form-floating position-relative mb-2" id={`list-item-${0}`}>
                                <input type="text" 
                                    value={element || ""}
                                    onChange={e => _handleChangeMetaList(idx, e)}
                                    className="form-control" 
                                    id={`list-${0}`} 
                                    name={`list-${0}`}
                                    />
                                <label htmlFor={`list-"${1}`}>List Text</label>
                                <i 
                                    onClick={() => _removeMetaListItem(idx)}
                                    className="btn bi bi-x-circle-fill text-danger position-absolute top-0 end-0 fs-5"></i>
                            </div>
                        ))}
                    </div>

                    <div className="d-flex justify-content-end mt-3">    
                        <button 
                            onClick={_addMetaListItem}
                            type="button" 
                            className="btn btn-light border shadow-sm">
                            Add item <i className="bi bi-plus-circle-fill"></i>
                        </button>
                    </div>
                </div>
            )}

            {metaType === "table" && (
                <div className="table-container mb-4">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                {tableHeaderShown 
                                ? <>
                                    <th scope="col">#</th>
                                    <th scope="col">
                                        <input type="text" 
                                            value={table.header[0] || ""}
                                            onChange={(e) => _handleChangeTableHeader(0, e)}
                                            placeholder="Enter Heading"
                                            className="form-control" 
                                            // id="option-a" 
                                            // name="optionA"
                                        />
                                    </th>
                                    <th scope="col">
                                        <input type="text" 
                                            value={table.header[1] || ""}
                                            onChange={(e) => _handleChangeTableHeader(1, e)}
                                            placeholder="Enter Heading"
                                            className="form-control" 
                                            // id="option-a" 
                                            // name="optionA"
                                        />
                                    </th>
                                    <th scope="col">
                                        <i 
                                            onClick={() => setTableHeaderShown(false)}
                                            className="btn bi bi-x-circle-fill text-danger d-flex justify-content-center"></i>
                                    </th>
                                </>
                                :    <th colSpan="4" className="text-end">    
                                        <button 
                                            onClick={() => setTableHeaderShown(true)}
                                            type="button" 
                                            className="btn btn-light border shadow-sm">
                                            Add Header <i className="bi bi-plus-circle-fill"></i>
                                        </button>
                                    </th>
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {table?.rows.map((element, idx) => (
                                <tr key={idx}>
                                    <th scope="row">{idx+1}</th>
                                    <th>
                                        <input type="text" 
                                            value={element[0] || ""}
                                            onChange={(e) => _handleChangeMetaTable(idx, 0, e)}
                                            placeholder="Enter Text"
                                            className="form-control" 
                                            // id="option-a" 
                                            // name="optionA"
                                        />
                                    </th>
                                    <th>
                                        <input type="text" 
                                            value={element[1] || ""}
                                            onChange={(e) => _handleChangeMetaTable(idx, 1, e)}
                                            placeholder="Enter Text"
                                            className="form-control" 
                                            // id="option-a" 
                                            // name="optionA"
                                        />
                                    </th>
                                    <td>
                                        <i 
                                            onClick={() => _removeMetaTableRow(idx)}
                                            className="btn bi bi-x-circle-fill text-danger d-flex justify-content-center"></i>
                                    </td>
                                </tr>
                            ))}
                            
                        </tbody>
                    </table>

                    <div className="d-flex justify-content-end mt-3">    
                        <button 
                            onClick={_addMetaTableRow}
                            type="button" 
                            className="btn btn-light border shadow-sm">
                            Add Row <i className="bi bi-plus-circle-fill"></i>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MetaOptions

MetaOptions.propTypes = {
    label: PropTypes.string.isRequired,
    metaState: PropTypes.object.isRequired,
    setMetaState: PropTypes.func.isRequired
}