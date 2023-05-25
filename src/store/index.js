import { createStore } from "vuex";
import authModule from "./modules/auth.module";
import errorModule from "./modules/error.module";
import loadingModule from "./modules/loading.module";
import userModule from "./modules/user.module";
import modalsModule from "./modules/modals.module";
import listsModule from "./modules/lists.module";
import wsModule from "./modules/ws.module";
import chatModule from "./modules/chat.module";

export default createStore({
  modules: {
    authModule,
    errorModule,
    loadingModule,
    userModule,
    modalsModule,
    listsModule,
    wsModule,
    chatModule,
  },
});
