import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const authCreds = {
  email: process.env.NEXT_PUBLIC_GUARD_EMAIL,
  password: process.env.NEXT_PUBLIC_GUARD_PASSWORD,
};

/**
 * Represents an admin.
 * @typedef {Object} Admin
 * @property {string} email - The admin's email.
 * @property {number} password - The admin's age.
 */

/**
 * Logs admin in using supabase
 * @param {Admin} authValues - the auth credentials
 * @returns {Promise<boolean>} true for success, false for failure
 */
export async function login(authValues) {
  const emailRegex =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

  if (!emailRegex.test(authValues.email)) {
    return false;
  }

  const { data, error } = await supabase.auth.signInWithPassword(authValues);

  if (error) {
    return false;
  }
  localStorage.setItem("BCuRm", data.session.access_token); // figure out how to stop cross-side scripting
  return true;
}

/**
 * Logs admin in locally
 * @param {Admin} authValues - the auth credentials
 * @returns {boolean} true for success, false for failure
 */
export function loginLocally(authValues) {
  if (
    authValues.email === authCreds.email &&
    authValues.password === authCreds.password
  ) {
    localStorage.setItem("BCuRm", authCreds.password); // figure out how to stop cross-side scripting
    return true;
  }
  return false;
}

/**
 * Checks whether admin is logged in
 * @param {Admin} authValues - the auth credentials
 * @returns {Promise<boolean>} true for success, false for failure
 */
export async function isLoggedIn() {
  const access_token = localStorage.getItem("BCuRm");

  if (access_token) {
    if (access_token === authCreds.password) return true;

    const {
      data: { user },
    } = await supabase.auth.getUser(access_token);

    if (user) return true;
  }

  return false;
}

/**
 * Logs admin out
 * @returns {Promise<boolean>} true for success, false for failure
 */
export function logout() {
  localStorage.removeItem("BCuRm");
}

/**
 * Wrap component with auth check
 */
export function withAuth(
  Component,
  isLoggedInFn,
  isNotLoggedInFn,
  failureRouting,
  successRouting
) {
  return function AuthenticatedComponent(props) {
    const router = useRouter();
    useEffect(() => {
      (async () => {
        const isLogged = await isLoggedIn();

        if (!isLogged) {
          isNotLoggedInFn();
          console.log("here");
          if (failureRouting) router.replace(failureRouting);
        } else {
          isLoggedInFn();
          if (successRouting) router.replace(successRouting);
        }
      })();
    }, []);

    return <Component {...props} />;
  };
}
