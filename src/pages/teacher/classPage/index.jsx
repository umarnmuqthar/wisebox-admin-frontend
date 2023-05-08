import "./styles.scss"
import { useEffect } from "react"
import { useHistory, useRouteMatch } from "react-router-dom"
import { connect } from "react-redux"
import { getClass } from "../../../redux/actions/dataAction"

const TeacherClassPage = ({ dispatch, classData, subjects, loading }) => {
    const history = useHistory()
    const match = useRouteMatch()

    useEffect(() => {
        /* get subjects for the classId */
        dispatch(getClass(match.params.class))
    }, [match.params.class, dispatch])

    return (
        <div className="container py-4">
            <div className="border-bottom mb-4">
                <h4>{!loading && classData?.name}</h4>
            </div>
            <div className="class-section mb-4">
                <div className="subjects">
                    <div className=" border-bottom mb-3">
                        <h5>Subjects</h5>
                    </div>
                    {loading 
                    ? (
                        <div className="d-flex justify-content-center">
                            <div className="spinner-grow text-success " role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )
                    :   <div className="row row-cols-2 row-cols-lg-5 g-2 g-lg-3">
                            {subjects?.length
                                ? subjects.map((subject, idx) => (
                                    <div className="col" key={idx}>
                                        <div className="px-3 py-2 shadow card-item" onClick={() => history.push(`${match.url}/${subject.slug}`)}>
                                            <h5>{subject.name}</h5>
                                            <h6>{subject.chapters.length} Chapters</h6>
                                        </div>
                                    </div>
                                    ))
                                : (
                                    <div className="text-primary">
                                        <h6>No Subjects</h6>
                                    </div>
                                )
                            }
                        </div>
                    }
                </div>
            </div>
            {/* <div className="class-section">
                <div className="papers">
                    <div className="border-bottom mb-3">
                        <h5>Previous Papers</h5>
                    </div>
                    <div className="row row-cols-2 row-cols-lg-5 g-2 g-lg-3">
                        <div className="col">
                            <div className="px-3 py-2 shadow card-item bg-secondary">
                                <h5>Zoology</h5>
                                <h6>11 Chapters</h6>
                            </div>
                        </div>
                        <div className="col">
                            <div className="px-3 py-2 shadow card-item bg-secondary">
                                <h5>Zoology</h5>
                                <h6>11 Chapters</h6>
                            </div>
                        </div>
                        <div className="col">
                            <div className="px-3 py-2 shadow card-item bg-secondary">
                                <h5>Zoology</h5>
                                <h6>11 Chapters</h6>
                            </div>
                        </div>
                        <div className="col">
                            <div className="px-3 py-2 shadow card-item bg-secondary">
                                <h5>Zoology</h5>
                                <h6>11 Chapters</h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        classData: state.data.class,
        subjects: state.data.class?.subjects ?? [],
        loading: state.data.loading /* && !state.data.subjects.length */
    }
}

export default connect(mapStateToProps)(TeacherClassPage)
