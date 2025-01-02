import { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";

// ===================== UTILS & AUTH =====================
import { setUser } from "../utils/auth";

/**
 * MainWrapper is a higher-order component that checks or refreshes user 
 * authentication before rendering its children. It manages loading and 
 * error states, and offers a retry mechanism in case of transient failures.
 */
const MainWrapper = ({ children }) => {
  // ===================== STATE =====================
  // Tracks whether the app is loading user data
  const [loading, setLoading] = useState(true);
  // Holds any error encountered during the user authentication process
  const [error, setError] = useState(null);

  // ===================== AUTH CHECK HANDLER =====================
  /**
   * handler is an async function (memoized with `useCallback`) that:
   * 1) Sets loading to true and clears any previous error.
   * 2) Tries to call `setUser()` from auth utilities (e.g. to refresh tokens).
   * 3) If an error occurs, it stores it in the `error` state.
   * 4) Resets loading to false once done.
   */
  const handler = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Attempt to authenticate or refresh tokens.
      await setUser();
    } catch (err) {
      // Log and store the error if something goes wrong.
      console.error("Failed to set user:", err);
      setError(err);
    } finally {
      // Make sure we stop the loading state, success or fail.
      setLoading(false);
    }
  }, []);

  // ===================== ON MOUNT (useEffect) =====================
  /**
   * We call `handler()` once after the component mounts, ensuring we check
   * or refresh user credentials right away.
   */
  useEffect(() => {
    handler();
  }, [handler]);

  // ===================== RENDER: LOADING STATE =====================
  /**
   * While we are in the process of setting or refreshing the user,
   * show a loading indicator. Replace with a spinner, skeleton, etc. if desired.
   */
  if (loading) {
    return <div>Loading...</div>;
  }

  // ===================== RENDER: ERROR STATE =====================
  /**
   * If an error occurred, show an error message and a "Retry" button
   * that calls `handler` again if the user wants to re-attempt the setup.
   */
  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
        <button onClick={handler}>Retry</button>
      </div>
    );
  }

  // ===================== RENDER: SUCCESS STATE =====================
  /**
   * If there's no error and we're not loading, render the child components
   * (i.e., the rest of the app).
   */
  return <>{children}</>;
};

// ===================== PROP TYPES =====================
MainWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainWrapper;
