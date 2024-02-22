import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { marked } from "marked";
import _ from "lodash";


const Welcome = () => {
    const [welcomePage, setWelcomePage] = useState<any>([])

    console.log('welcomePage', welcomePage)

    useEffect(() => {

        const getPageData = async () => {
            try {
                await axios.get(`/api/getWelcomePage`)
                    .then((res: any) => {
                        console.log('res from fetching welcome page: ', res.data)
                        let responseData = _.cloneDeep(res.data);


                        marked.setOptions({
                            breaks: true,
                            headerIds: false,
                            mangle: false
                        });


                        // let editedResult = matchingFile.content.replace(/\n(?=\n)/g, "\n\n<br/>\n")

                        let editedResult = responseData.welcomePageData[0].content.replace(/\n(?=\n)/g, "\n\n<br/>\n")


                        // const markedWelcomePageData = responseData.welcomePageData.map((obj: any) => ({
                        //     ...obj,
                        //     content: marked(obj.content),
                        // }));


                        responseData.welcomePageData[0].content = marked(editedResult);
                        let markedWelcomePageData = responseData.welcomePageData

                        setWelcomePage(markedWelcomePageData[0])
                    })
                    .catch((err: any) => {
                        console.log('Error fetching node colors', err)
                    })

            } catch (error) {
                console.log("error getPageData", error)
            }

        }

        getPageData()

    }, [])




    return (
        <div>
            <div dangerouslySetInnerHTML={{ __html: welcomePage.content }}></div>
        </div>
    )
}

export default Welcome