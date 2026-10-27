import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { marked } from "marked";
import _ from "lodash";
import { FullPageComponentLoading } from '@/util/FullPageComponentLoading';


const Welcome = () => {
    const [welcomePage, setWelcomePage] = useState<any>([])
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {

        const getPageData = async () => {
            try {
                await axios.get(`/api/getWelcomePage`)
                    .then((res: any) => {
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
                        setLoading(false);
                    })
                    .catch((err: any) => {
                        console.log('Error fetching node colors', err)
                        setLoading(false);
                    })

            } catch (error) {
                console.log("error getPageData", error)
            }

        }

        getPageData()

    }, [])

    // if (loading) {
    //     return <div style={{display: 'flex' , alignItems: 'center' , justifyContent: 'center' , height:'100vh'}}>Loading...</div>;
    // }




    return (
        <div>
            {loading ? (
                <FullPageComponentLoading></FullPageComponentLoading>
            ):(
                <div className='welcome-page-top-container'>
                    <div className='welcome-page-main'>
                        <div className='welcome-page-container' dangerouslySetInnerHTML={{ __html: welcomePage.content }}></div>
                    </div>
                </div>
            )}
            
        </div>
    )
}

export default Welcome