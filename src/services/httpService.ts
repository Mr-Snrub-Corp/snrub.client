const api: { [key: string]: any } = {};
const baseUrl = import.meta.env.VITE_API_URL; // Example usage of process;
const headers = { "Content-Type": "application/json" };

function generateApi(endpoint: string) {
  return {
    get: () => fetch(`${baseUrl}/${endpoint}`, { method: "GET" }).then((res) => res.json()),
    getOne: (uid: string) =>
      fetch(`${baseUrl}/${endpoint}/${uid}`, { method: "GET" }).then((res) => res.json()),
    create: <T>(
      data: T, // function to use a generic type parameter T
    ) =>
      fetch(`${baseUrl}/${endpoint}`, { method: "POST", body: JSON.stringify(data) }).then((res) =>
        res.json(),
      ),
    // check whether we need JSON.stringify
    updateOne: <T>(uid: string, data: T) =>
      fetch(`${baseUrl}/${endpoint}/${uid}`, { method: "PUT", body: JSON.stringify(data) }).then(
        (res) => res.json(),
      ),
    deleteOne: (uid: string) =>
      fetch(`${baseUrl}/${endpoint}/${uid}`, { method: "DELETE" }).then((res) => res.json()),
  };
}

[{ name: "employee" }, { name: "todos" }].forEach(({ name }) => {
  api[name] = generateApi(name);
});

api["auth"] = {
  login: <T>(data: T) =>
    fetch(`${baseUrl}/auth/login`, {
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
