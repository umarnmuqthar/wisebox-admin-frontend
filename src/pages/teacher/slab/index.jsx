import MathJax from "mathjax3-react";
import './styles.scss'
// import { Button, Modal } from 'react-bootstrap'
import Modal from '../../../components/modal'
import React, { useEffect, useState, useCallback } from 'react'
import { connect } from 'react-redux'
import { useRouteMatch } from 'react-router-dom'
import { getSlab } from '../../../redux/actions/dataAction'
import MetaOptions from '../../../components/metaOptions/MetaOptions'
import { addQuestion, deleteQuestion, updateQuestion,updateSlabPoints } from '../../../redux/actions/teacherAction'
import Input from '../../../components/input'
import SlabPoints from "../../../components/points-modal/SlabPoints";

const TeacherSlabPage = ({ dispatch, loading, questions, slab, points }) => {
    const match = useRouteMatch()
    const [ show, setShow ] = useState(false)
    const [ showSlabPoints, setShowSlabPoints ] = useState(false)
    const [ selectedQno, setSelectedQno ] = useState(1)
    const [ modalState, setModalState ] = useState(0) /* 0-add, 1-update */
    const [ inputData, setInputData ] = useState({
        question: "",
        answers: new Array(4).fill(""),
        answer: "",
        explanation: "",
    })
    const [ questionMeta, setQuestionMeta ] = useState({})
    const [ explanationMeta, setExplanationMeta ] = useState({})
    const [pointsState, setPointsState] = useState([""]);

    const _showModal= () => {
        setModalState(0)
        setShow(true)
    }

    const _hideModal = () => {
        setShow(false)
        setInputData({
            question: "",
            answers: new Array(4).fill(""),
            answer: "",
            explanation: "",
        })
        setQuestionMeta({})
        setExplanationMeta({})
    }

    const _handleSubmit = () => {

        // if(modalState === 1) return setShow(false)

        let data = {
            ...inputData,
            questionMeta,
            explanationMeta,
            slabSlug: match.params.slab
        }

        /* form data for image */
        const formData = new FormData()
        // formData.append('data', JSON.stringify(data))

        if(questionMeta.metaType === "image") {
            formData.append('questionMetaImage', questionMeta.image)
        }
        if(explanationMeta.metaType === "image") {
            formData.append('explanationMetaImage', explanationMeta.image)
        }

        //TODO: validation
        if (modalState === 0) {
            /* check whether image is there
            - if yes convert data to formdata */
            // const formData = new FormData()
            formData.append('data', JSON.stringify(data))

            // if(questionMeta.metaType === "image") {
            //     formData.append('questionMetaImage', questionMeta.image)
            // }
            // if(explanationMeta.metaType === "image") {
            //     formData.append('explanationMetaImage', explanationMeta.image)
            // }

            /* Add question */
            dispatch(addQuestion( data.slabSlug, formData ))
                .then(() => {
                    setShow(false)
                    setInputData({
                        question: "",
                        answers: new Array(4).fill(""),
                        answer: "",
                        explanation: "",
                    })
                    setQuestionMeta({})
                    setExplanationMeta({})
                    setSelectedQno(questions.length + 1)
                })
                .catch(err => console.log(err))
        } else {
            /* Update */
            const updateData = {
                question: data.question,
                questionMeta: data.questionMeta,
                answers: data.answers,
                answer: data.answer,
                explanation: data.explanation,
                explanationMeta: data.explanationMeta,
            }

            if(questionMeta.metaType === "image" && (questionMeta.image === '')) {
                updateData.questionMeta = inputData.questionMeta
            }
            if(explanationMeta.metaType === "image" && (explanationMeta.image === '')) {
                updateData.explanationMeta = inputData.explanationMeta
            }

            //add the updateData to formdata
            formData.append('data', JSON.stringify(updateData))
            console.log(updateData)
            dispatch(updateQuestion({ _id: inputData._id, data: formData, slabSlug: match.params.slab}))
                .then(() => {
                    setShow(false)
                    setInputData({
                        question: "",
                        answers: new Array(4).fill(""),
                        answer: "",
                        explanation: "",
                    })
                    setQuestionMeta({})
                    setExplanationMeta({})
                })
                .catch(err => console.log(err))
        }
    }

    const _onchange = (e) => {
        const field = e.target.name
        if (field.split("-")[0] === "option") {
            const index = field.split("-")[1]
            let newAnswers = [...inputData.answers]
            newAnswers[index] = e.target.value
            setInputData({
                ...inputData, answers: newAnswers
            })
            return
        }

        setInputData({ ...inputData, [field]: e.target.value })
    }

    const _editQuestion = () => {
        setModalState(1)
        let question = questions?.filter((_, idx) => idx === selectedQno - 1)[0]
        let answers = question?.answers.map((option) => option.text)

        setInputData({...question, answers})
        setQuestionMeta(question?.questionMeta)
        setExplanationMeta(question?.explanationMeta)
        setShow(true)
    }

    const _deleteQuestion = () => {
        const deleteConfirm = window.confirm("Are you sure you want to delete?")
        if(!deleteConfirm) return
        const id = questions[selectedQno - 1]?._id
        dispatch(deleteQuestion({id, slabSlug: match.params.slab }))
        if(selectedQno >= questions?.length) {
            setSelectedQno(questions?.length - 1)
        }
    }

    const _handleSubmitPoints = () => {
        const data = {
            slabSlug: slab.slug,
            points: pointsState,
        }
        dispatch(updateSlabPoints(data))
            .then(() => setShowSlabPoints(false))
    }

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
                        onClick={() => {
                            setShowSlabPoints(true)
                            setPointsState(slab.points)
                        }}
                        className="btn btn-light me-3">
                            <i className="bi bi-clipboard-data"/>
                            {" "}Slab Points
                    </button>
                    <button type="button" 
                        className="btn btn-success me-3"
                        onClick={_editQuestion}
                        disabled={questions?.length === 0}
                    >
                        Update
                    </button>
                    <button type="button" 
                        className="btn btn-danger me-3"
                        onClick={_deleteQuestion}
                        disabled={questions?.length === 0}
                    >
                        Delete
                    </button>
                    <button type="button" 
                            className="btn btn-primary" 
                            onClick={_showModal}
                        >
                        Add Question
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
            </MathJax.Provider>

            <Modal 
                show={show}
                loading={loading}
                isUpdate={modalState}
                title="Add Question"
                _handleSubmit={_handleSubmit}
                _hideModal={_hideModal}
            >
                <form className="question-form">
                    <Input
                        type="text" 
                        value={inputData.question}
                        onChange={_onchange}
                        className="form-control" 
                        id="question-input" 
                        name="question"
                        label="Question"
                        textarea={true}
                    />

                    <MetaOptions label={"Question MetaData"} metaState={questionMeta} setMetaState={setQuestionMeta}/>

                    {["A", "B", "C", "D"].map((item, idx) => (
                        <div key={idx} className="form-floating mb-3">
                            <Input
                                type="text" 
                                value={inputData.answers[idx]}
                                onChange={_onchange}
                                className="form-control" 
                                id="option-a" 
                                name={`option-${idx}`}
                                label={`Option ${item}`}
                            />
                        </div>
                    ))}

                    <div className="form-floating mb-3">
                        <select className="form-select" 
                            id="answer" 
                            name="answer"  
                            aria-label="Answer"
                            onChange={_onchange}
                            value={inputData.answer}
                        >
                            <option defaultValue>None</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                        </select>
                        <label htmlFor="floatingSelect">Answer</label>
                    </div>

                    <Input
                        type="text" 
                        value={inputData.explanation}
                        onChange={_onchange}
                        className="form-control" 
                        id="explanation" 
                        name="explanation"
                        label="Explanation"
                        textarea
                    />
                    
                    <MetaOptions label={"Explanation MetaData"} metaState={explanationMeta} setMetaState={setExplanationMeta}/>
                </form>
            </Modal>

            <SlabPoints
                showSlabPoints={showSlabPoints}
                _hideModal={() => setShowSlabPoints(false)}
                points={pointsState}
                editable={true}
                setPoints={setPointsState}
                _handleSubmit={_handleSubmitPoints}
             />
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
