import { createRouter, createWebHistory } from "vue-router";
import store from "../store";
import HomeView from "../views/HomeView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    title: "FriendlyGlobe",
    component: HomeView,
  },
  {
    path: "/admin",
    name: "AdminPanelRoute",
    meta: {
      title: "Admin panel",
      requiresAuth: true,
      onlyAdmin: true,
    },
    component: () => import("../views/Admin/AdminPanelView.vue"),
  },
  {
    path: "/search",
    name: "UsersSearch",
    meta: {
      title: "Find friends",
      requiresAuth: true,
      onlyVerified: true,
    },
    component: () => import("../views/UsersSearch.vue"),
  },
  {
    path: "/users/:username",
    name: "UserProfile",
    meta: {
      title: "User",
      requiresAuth: true,
    },
    component: () => import("../views/Profile/ProfileView.vue"),
  },
  {
    path: "/profile/update",
    name: "UpdateProfile",
    meta: {
      title: "Update profile",
      requiresAuth: true,
    },
    component: () => import("../views/Profile/UpdateProfile.vue"),
  },
  {
    path: "/chats",
    name: "ChatsPage",
    meta: {
      title: "Chats",
      requiresAuth: true,
      onlyVerified: true,
    },
    component: () => import("../views/ChatsView.vue"),
  },
  {
    path: "/calls",
    name: "CallsPage",
    meta: {
      title: "Call",
      requiresAuth: true,
      onlyVerified: true,
    },
    component: () => import("../views/CallView.vue"),
  },
  {
    path: "/profile/blacklist",
    name: "ProfileBlacklist",
    meta: {
      title: "Your blacklist",
      requiresAuth: true,
    },
    component: () => import("../views/Profile/BlacklistView.vue"),
  },
  {
    path: "/signin",
    name: "SignInRoute",
    meta: { title: "Sign In", onlyUnAuth: true },
    component: () => import("../views/Auth/SignInView.vue"),
  },

  {
    path: "/signup",
    name: "SignUpRoute",
    meta: { title: "Sign Up", onlyUnAuth: true },
    component: () => import("../views/Auth/SignUpView.vue"),
  },
  {
    path: "/404",
    name: "404",
    meta: {
      title: "Not Found",
    },
    component: function () {
      return import("../views/NotFound.vue");
    },
  },
  {
    path: "/500",
    name: "500",
    meta: {
      title: "Server Internal Error",
    },
    component: function () {
      return import("../views/ServerError.vue");
    },
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

const getCurrUser = async () => {
  if (store.getters.isAuthenticated) return store.getters.getPayload;
  await store.dispatch("refreshTokens");
  if (store.getters.isAuthenticated) return store.getters.getPayload;
  return null;
};

const requiresLoading = (toRoute) => {
  if (toRoute.matched.some((record) => record.meta.requiresLoading)) {
    store.commit("setLoadingStatus", true);
  } else {
    store.commit("setLoadingStatus", false);
  }
};

router.beforeEach(async (toRoute, fromRoute, next) => {
  window.document.title =
    toRoute.meta && toRoute.meta.title ? toRoute.meta.title : "FriendlyGlobe";
  if (store.getters.getErrorMessage !== "") store.dispatch("resetErrorMessage");
  requiresLoading(toRoute);
  if (toRoute.matched.some((record) => record.meta.requiresAuth)) {
    const user = await getCurrUser();
    if (user) {
      if (toRoute.meta.onlyAdmin && !store.getters.isAdmin)
        return next(`/users/${user.username}`);
      if (toRoute.meta.onlyVerified && !store.getters.getPayload.verified)
        return next(`/users/${user.username}`);
      return next();
    }
    return next("/signin");
  } else if (toRoute.matched.some((record) => record.meta.onlyUnAuth)) {
    if (await getCurrUser()) {
      return next("/");
    }
  }
  next();
});

export default router;
