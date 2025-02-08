const api = {};
const baseUrl = import.meta.env.VITE_API_URL; // Example usage of process;
const headers = { "Content-Type": "application/json" };

function generateApi(endpoint) {
  return {
    get: () => fetch(`${baseUrl}/${endpoint}`, { method: "GET" }).then((res) => res.json()),
    getOne: (id) =>
      fetch(`${baseUrl}/${endpoint}/${id}`, { method: "GET" }).then((res) => res.json()),
    create: (data) =>
      fetch(`${baseUrl}/${endpoint}`, { method: "POST", body: JSON.stringify(data) }).then((res) =>
        res.json(),
      ),
    // check whether we need JSON.stringify
    updateOne: (id, data) =>
      fetch(`${baseUrl}/${endpoint}/${id}`, { method: "PUT", body: JSON.stringify(data) }).then(
        (res) => res.json(),
      ),
    deleteOne: (id) =>
      fetch(`${baseUrl}/${endpoint}/${id}`, { method: "DELETE" }).then((res) => res.json()),
  };
}

[{ name: "employee" }, { name: "todos" }].forEach(({ name }) => {
  api[name] = generateApi(name);
});

export default api;
