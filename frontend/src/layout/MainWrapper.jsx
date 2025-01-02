import { useEffect, useState, useCallback } from "react";
import { setUser } from "../utils/auth";
import PropTypes from "prop-types";

const MainWrapper = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handler = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            await setUser();
        } catch (err) {
            console.error("Failed to set user:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        handler();
    }, [handler]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return (
            <div>
                Error: {error.message}
                <button onClick={handler}>Retry</button>
            </div>
        );
    }

    return <>{children}</>;
};

MainWrapper.propTypes = {
    children: PropTypes.node.isRequired,
};

export default MainWrapper;