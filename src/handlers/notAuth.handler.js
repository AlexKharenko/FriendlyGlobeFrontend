export default async function notAuthorized(onError, onSuccess) {
  const response = await fetch(
    `${process.env.VUE_APP_SERVER_URL}/auth/refresh`,
    {
      method: "POST",
      credentials: "include",
    }
  );
  const { status } = response;
  const JSONResponse = await response.json();
  if (status >= 400) {
    return onError(JSONResponse);
  } else if (status === 200) return onSuccess(JSONResponse);
}
