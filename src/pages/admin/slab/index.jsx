import MathJax from "mathjax3-react";
import './styles.scss'
// import { Button, Modal } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useRouteMatch } from 'react-router-dom'
import { getSlab } from '../../../redux/actions/dataAction'
import SlabPoints from "../../../components/points-modal/SlabPoints";
// import MetaOptions from '../../../components/metaOptions/MetaOptions'
// import { addQuestion, deleteQuestion, updateQuestion } from '../../../redux/actions/teacherAction'
// import Input from '../../../components/input'

const TeacherSlabPage = ({ dispatch, loading, questions, slab, points }) => {
    const match = useRouteMatch()
    const [ selectedQno, setSelectedQno ] = useState(1)
    const [ showSlabPoints, setShowSlabPoints ] = useState(false)
    const [pointsState, setPointsState] = useState([]);

    useEffect(() => {
        dispatch(getSlab(match.params.slab))
    }, [match.params.slab, dispatch])

    useEffect(() => {
        setPointsState(points)
    }, [points])

    return (
        <div className="container py-4">
            <MathJax.Provider
                url="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"
                options={{
                    tex: {
                        inlineMath: [['$', '$'], ['\\(', '\\)']]
                    },
                }}
            >
            <div className="border-bottom pb-3  d-flex justify-content-between question-top">
                <h4>{!loading && slab?.title}</h4>
                <div className="float-end add-button action-buttons">
                    <button type="button"
                        onClick={() => setShowSlabPoints(true)} 
                        className="btn btn-light me-3">
                            <i className="bi bi-clipboard-data"/>
                            {" "}Slab Points
                    </button>
                </div>
            </div>

            {loading 
            ?   (
                <div className="position-absolute top-50 start-50 translate-middle">
                    <div className="spinner-grow text-success " role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
                )
            :   <>
                    <div className="question-select border-bottom my-3 pb-3">
                        {[...Array(questions?.length)].map((_, idx) => (
                            <span 
                                key={idx}
                                className={`badge rounded ${ idx + 1 === selectedQno ? "bg-dark" : "bg-light text-dark"} shadow-md mx-2`} 
                                onClick={() => setSelectedQno(idx + 1)}>
                                    {idx + 1}
                            </span>
                        ))}
                    </div>
                    
                    <div className="question-section mt-3">
                        { questions?.length === 0 
                        ? (
                            <div className="text-primary">
                                <div className="text-center">
                                    <h6>No Questions</h6>
                                </div>
                            </div> 
                        )
                        : questions?.map((question, idx) => 
                            selectedQno === idx+1 ? (
                                    <div key={question._id} className="question-card shadow rounded p-3">
                                        {/* <h5>{selectedQno}. {question.question}</h5> */}

                                        {/* <h6> */}
                                            <MathJax.Html html={`<h6>${selectedQno}. ${question.question}<h6>`}/>
                                        {/* </h6> */}
                                        <div className="ms-4">
                                            <div className="question-meta border-bottom">
                                                {/* <p className="m-0">Question Meta</p> */}
                                                { question.questionMeta.metaType === "list" && (
                                                    <ol type={question.questionMeta?.list?.listType}>
                                                        {question.questionMeta?.list?.items.map((item, idx) => (
                                                            // <li key={idx}>{item}</li>
                                                            <li key={idx} dangerouslySetInnerHTML={{__html: item}}/>
                                                        ))}
                                                    </ol>
                                                )}
                                                { question.questionMeta.metaType === "table" && (
                                                    <table className="slabs-table table text-center table-bordered table-striped mt-3 w-50">
                                                        <thead className="table-dark">
                                                            <tr>
                                                                <th scope="col">#</th>
                                                                {question.questionMeta?.table?.header.map((item, idx) => (
                                                                    // <th key={idx} scope="col">{item}</th>
                                                                    <th key={idx} scope="col" dangerouslySetInnerHTML={{__html: item}}/>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {question.questionMeta?.table?.rows.map((row, idx) => (
                                                                    <tr key={idx}>
                                                                        <th scope="row">{idx+1}</th>
                                                                        {row.map((item, i) => (
                                                                            // <td key={i} className="slab-title col-6">{item}</td>
                                                                            <td key={i} className="slab-title col-6" dangerouslySetInnerHTML={{__html: item}}/>
                                                                        ))}
                                                                    </tr>
                                                                ))
                                                            }
                                                        </tbody>
                                                    </table>
                                                )}
                                                { question.questionMeta.metaType === "image" && (
                                                    // {previewImage && 
                                                    <div className="meta-image-container my-4">
                                                        <img src={question.questionMeta.imageUrl} 
                                                            name={`qmeta-img`}
                                                            className="rounded d-block" 
                                                            alt="metaImage"/>
                                                    </div>
                                                    // }
                                                )}
                                            </div>
                                            <div className="answers pt-2 border-bottom">
                                                <h6>Options:-</h6>
                                                <ol type="A">
                                                    {question.answers.map((option, idx) => (
                                                        // <li key={option._id}>{option.text}</li>
                                                        <li key={option._id} dangerouslySetInnerHTML={{__html: option.text}}/>
                                                    ))}
                                                </ol>
                                                <p><b>Answer: {question.answer}</b></p>
                                            </div>
                                            <div className="explanation-answer pt-2">
                                                {question.explanation && <h6>Explanation:-</h6>}
                                                {/* <p className="m-0">{question.explanation}</p> */}
                                                <p className="m-0" dangerouslySetInnerHTML={{__html: question.explanation}}/>
                                                <div className="explanation-meta">
                                                    {/* <p className="m-0">Explanation Meta</p> */}
                                                    { question.explanationMeta.metaType === "list" && (
                                                        <ol type={question.explanationMeta?.list.listType}>
                                                            {question.explanationMeta?.list?.items.map((item, idx) => (
                                                                // <li key={idx}>{item}</li>
                                                                <li key={idx} dangerouslySetInnerHTML={{__html: item}}/>
                                                            ))}
                                                        </ol>
                                                    )}
                                                    { question.explanationMeta.metaType === "table" && (
                                                        <table className="slabs-table table text-center table-bordered table-striped align-middle mt-3 w-50">
                                                            <thead className="table-dark">
                                                                <tr>
                                                                    <th scope="col">#</th>
                                                                    {question.explanationMeta?.table?.header.map((item, idx) => (
                                                                        // <th key={idx} scope="col">{item}</th>
                                                                        <th key={idx} scope="col" dangerouslySetInnerHTML={{__html: item}}/>
                                                                    ))}
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {question.explanationMeta?.table?.rows.map((row, idx) => (
                                                                        <tr key={idx}>
                                                                            <th scope="row">{idx+1}</th>
                                                                            {row.map((item, i) => (
                                                                                // <td key={i} /* scope="row" */ className="slab-title col-6">{item}</td>
                                                                                <td key={i} className="slab-title col-6" dangerouslySetInnerHTML={{__html: item}}/>
                                                                            ))}
                                                                            {/* <td className="slab-title col-7">asdfds</td> */}
                                                                        </tr>
                                                                    ))
                                                                }
                                                            </tbody>
                                                        </table>
                                                    )}
                                                    { question.explanationMeta.metaType === "image" && (
                                                        // {previewImage && 
                                                        <div className="meta-image-container my-4">
                                                            <img src={question.explanationMeta.imageUrl} 
                                                                name={`expmeta-img`}
                                                                className="rounded d-block" 
                                                                alt="metaImage"/>
                                                        </div>
                                                        // }
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {/* <div className="question-actions mt-3 d-flex justify-content-end">
                                            <button type="button" className="btn btn-success me-3">Update</button>
                                            <button type="button" className="btn btn-danger">Delete</button>
                                        </div> */}
                                    </div>
                                )
                            : null
                            )
                        }
                    </div>
                </>
            }
            <SlabPoints 
                showSlabPoints={showSlabPoints}
                _hideModal={() => setShowSlabPoints(false)}
                points={pointsState}/>
            </MathJax.Provider>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        loading: state.data.loading,
        questions: state.data.slab?.questions,
        slab: state.data.slab,
        points: state.data.slab?.points
    }
}
export default connect(mapStateToProps)(TeacherSlabPage)
