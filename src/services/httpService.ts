const api: { [key: string]: any } = {};
const baseUrl = import.meta.env.VITE_API_URL; // Example usage of process;
const headers = { "Content-Type": "application/json" };
import { useAuthStore } from "../stores/auth";

// Function that works with both store and fallback to localStorage
function getHeaders() {
  // Try to get from store first
  try {
    const authStore = useAuthStore();
    if (authStore.token) {
      return { ...headers, Authorization: `Bearer ${authStore.token}` };
    }
  } catch (e) {
    // If store can't be accessed (outside setup context)
    console.debug("Falling back to localStorage for auth token");
  }

  // Fallback to localStorage
  // const token = localStorage.getItem('authToken');
  // return token
  //   ? { ...headers, "Authorization": `Bearer ${token}` }
  //   : headers;
}

function generateApi(endpoint: string) {
  return {
    get: () =>
      fetch(`${baseUrl}/${endpoint}`, { method: "GET", headers: getHeaders() }).then((res) =>
        res.json(),
      ),
    getOne: (uid: string) =>
      fetch(`${baseUrl}/${endpoint}/${uid}`, { method: "GET", headers: getHeaders() }).then((res) =>
        res.json(),
      ),
    create: <T>(
      data: T, // function to use a generic type parameter T
    ) =>
      fetch(`${baseUrl}/${endpoint}`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: getHeaders(),
      }).then((res) => res.json()),
    // check whether we need JSON.stringify
    updateOne: <T>(uid: string, data: T) =>
      fetch(`${baseUrl}/${endpoint}/${uid}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: getHeaders(),
      }).then((res) => res.json()),
    deleteOne: (uid: string) =>
      fetch(`${baseUrl}/${endpoint}/${uid}`, { method: "DELETE", headers: getHeaders() }).then(
        (res) => res.json(),
      ),
  };
}

[{ name: "users" }].forEach(({ name }) => {
  api[name] = generateApi(name);
});

api["auth"] = {
  login: <T>(data: T) =>
    fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      body: JSON.stringify(data),
      headers,
    }).then((res) => res.json()),
  reset: <T>(data: T) =>
    fetch(`${baseUrl}/auth/request-reset-password`, {
      method: "POST",
      body: JSON.stringify(data),
      headers,
    }).then((res) => res.json()),
  signup: <T>(data: T) =>
    fetch(`${baseUrl}/auth/signup`, {
      method: "POST",
      body: JSON.stringify(data),
      headers,
    }).then((res) => res.json()),
};

export default api;
