import React, { useState } from "react";
import Input from "../input";
import Modal from "../modal";
import MathJax from "mathjax3-react";

const SlabPoints = ({ showSlabPoints, setPoints, points, editable = false, _handleSubmit = () => {{}}, _hideModal}) => {
    // const [pointsState, setPoints] = useState(points || []);
    const [isViewMode, setViewMode] = useState(editable);
    
    const _addListItem = () => {
        setPoints([...points, ""]);
    };  

    const _removeListItem = (idx) => {
        let newPoints = [...points];
        newPoints.splice(idx, 1);
        setPoints(newPoints);
    };

    const _handleChangeList = (idx, e) => {
        let newPoints = [...points];
        newPoints[idx] = e.target.value;
        setPoints(newPoints);
    };

    const _setViewState = () => {
        setViewMode(!isViewMode)
    }

    return (
        <div>
            <MathJax.Provider
                url="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"
                options={{
                    tex: {
                        inlineMath: [['$', '$'], ['\\(', '\\)']]
                    },
                }}
            >
                <Modal
                    show={showSlabPoints}
                    loading={false}
                    isUpdate={1}
                    title="Slab Points"
                    _handleSubmit={_handleSubmit}
                    _hideModal={_hideModal}
                    isActionShown={editable}
                >
                    <form className="question-form">
                        <div className="mb-4">
                            {editable && (
                                <div className="d-flex justify-content-end">
                                    <div className="form-check form-switch">
                                        <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            id="viewmodechecked" 
                                            value={isViewMode}
                                            onChange={_setViewState}/>
                                        <label className="form-check-label" htmlFor="flexSwitchCheckChecked">View</label>
                                    </div>
                                </div>
                            )}
                            {isViewMode ? (
                                <div>
                                    {/* <div className="form-floating mb-2">
                                <select 
                                    className="form-select" 
                                    id={`slabpoint-list-type`} 
                                    aria-label={`slabpoint-list-type`}
                                    // onChange={(e) => setMetaList({ ...list, listType: e.target.value })}
                                >
                                    <option value="a" defaultValue>a</option>
                                    <option value="A">A</option>
                                    <option value="1">1</option>
                                    <option value="i">i</option>
                                    <option value="I">II</option>
                                </select>
                                <label htmlFor={`slabpoint-list-type`}>List Type</label>
                            </div> */}

                                    <div id="metalist-container">
                                        {points?.map((element, idx) => (
                                            <div
                                                key={idx}
                                                className="form-floating position-relative mb-2"
                                                id={`list-item-${0}`}
                                            >
                                                <Input
                                                    type="text"
                                                    value={element}
                                                    onChange={(e) =>
                                                        _handleChangeList(idx, e)
                                                    }
                                                    className="form-control"
                                                    id={`list-${0}`}
                                                    name={`list-${0}`}
                                                    label="Point Text"
                                                    textarea={true}
                                                />
                                                <i
                                                    onClick={() =>
                                                        _removeListItem(idx)
                                                    }
                                                    className="btn bi bi-x-circle-fill text-danger position-absolute top-0 end-0 fs-5"
                                                ></i>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="d-flex justify-content-end mt-3">
                                        <button
                                            onClick={_addListItem}
                                            type="button"
                                            className="btn btn-light border shadow-sm"
                                        >
                                            Add Point{" "}
                                            <i className="bi bi-plus-circle-fill"></i>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    {points?.map((point, idx) => (
                                        <div key={idx} className="d-flex shadow-sm rounded px-2 py-3 card flex-row mt-2">
                                            <MathJax.Html html={``}/>
                                            <span className="fw-bold me-2">{idx+1}. </span><div dangerouslySetInnerHTML={{__html: point}}/>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </form>
                </Modal>
            </MathJax.Provider>
        </div>
    );
};

export default SlabPoints;
