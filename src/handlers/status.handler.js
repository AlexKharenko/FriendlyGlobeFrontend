import router from "@/router";
import notAuthorized from "./notAuth.handler";
import store from "../store/index";

const onError = ({ message }) => {
  router.push("/signin");
  store.dispatch("setErrorMessage", message);
  return;
};

export default async function statusHandler(
  response,
  onUnAuthError = () => {}
) {
  const { status } = response;
  if (status == 200 || status == 201) {
    const json = await response.json();
    return json;
  } else {
    if (status === 401) {
      return notAuthorized(onError, async () => {
        const res = await onUnAuthError();
        if (res.status !== 401) return statusHandler(res);
        store.dispatch("setIsAuthenticated", false);
        const json = await res.json();
        return json;
      });
    } else if (status === 400 || status === 403) {
      const JSONResponse = await response.json();
      store.dispatch("setErrorMessage", JSONResponse.message);
      return JSONResponse;
    } else if (status === 404) return router.push("/404");
    else if (status >= 500) return router.push("/500");
  }
}
