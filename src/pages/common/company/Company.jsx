import styles from "./Company.module.scss";
import React, { useState } from "react";
import { useEffect } from "react";
import { useRouteMatch } from "react-router-dom/cjs/react-router-dom.min";
import axios from '../../../api'

const Company = () => {
    const match = useRouteMatch()
    const [pageData, setPageData] = useState({}) 

    useEffect(() => {
        const slug = match.params.slug
        axios.get(`/company/${slug}`)
            .then(res => {
                setPageData(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    }, [match?.params.slug])

    return (
        <div className={`${styles.container} container-sm py-4`}>
            <h4 className={styles.title}>{pageData.title}</h4>
            <div dangerouslySetInnerHTML={{ __html: pageData.page_content }} />
        </div>
    );
};

export default Company;
