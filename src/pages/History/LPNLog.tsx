
import React, {useEffect, useState} from "react";
import {useNotification} from "../../context/NotificationContext";
import {getLPNLog} from "../../api/logApiService";


interface LPNLogProp {
    setLoading: (b: boolean) => void;
}

const LPNLog: React.FC<LPNLogProp> = ({setLoading}) => {

    const {sendNotification} = useNotification();


    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const data = await getLPNLog(0);
            } catch (error) {
                sendNotification(
                    "error",
                    "Error fetching LPN data",
                    error instanceof Error ? error.message : String(error)
                );
            } finally {
                setLoading(true); // Hide loader
            }
        };

        fetchData();
    }, []); // Empty dependency array ensures this runs once on mount

    return (
        <>

        </>
    )
}

export default LPNLog;

