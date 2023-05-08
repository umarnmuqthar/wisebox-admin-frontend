import "./styles.scss"
import { useHistory } from "react-router-dom"
import { connect } from "react-redux"

const TeacherHomePage = ({ boards, loading }) => {
    const history = useHistory()

    return (
        <div className="container py-4">
            {loading 
            ? (
                <div className="position-absolute top-50 start-50 translate-middle">
                    <div className="spinner-grow text-success " role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )
            : boards.length ? 
                boards.map((board) => (
                    <div className="home-sections mb-4" key={board.slug}>
                        <div className="border-bottom mb-3">
                            <h4>{board.name}</h4>
                        </div>
                        <div className="subjects">
                            <div className="row row-cols-2 row-cols-lg-5 g-2 g-lg-3">
                                {board.classes.map((cls) => (
                                    <div className="col" key={cls.slug}>
                                        <div className="px-3 py-2 shadow card-item" 
                                            onClick={() => history.push(`/teacher/${board.slug}/${cls.slug}`)}
                                            >
                                            <h6>{cls.name}</h6>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                </div>
                ))
                : (
                    <div className="text-primary">
                        <div className="text-center">
                            <h4>No Boards</h4>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        boards: state.data.boards,
        loading: state.data.loading /* && !state.data.boards.length */
    }
}

export default connect(mapStateToProps)(TeacherHomePage)
