import { http, HttpResponse } from "msw";
import { makeUser } from "@/test/factories/user.factory";
import { makeIncidentType } from "@/test/factories/incidentType.factory";
import { makeIncidentReport } from "@/test/factories/incidentReport.factory";
import type { User } from "@/types/user";

const API = import.meta.env.VITE_API_URL;

// Default happy-path handlers. Individual tests override per-case with server.use(...).
export const handlers = [
  http.post(`${API}/auth/login`, () =>
    HttpResponse.json({ access_token: "test-token", user: makeUser({ uid: "u1" }) }),
  ),
  http.post(`${API}/auth/request-password-reset`, () => HttpResponse.json({ message: "ok" })),
  http.post(`${API}/auth/reset-password`, () => HttpResponse.json({ message: "ok" })),
  http.get(`${API}/auth/google/token`, () =>
    HttpResponse.json({ access_token: "google-token", user: makeUser({ uid: "u1" }) }),
  ),
  http.get(`${API}/users`, () => HttpResponse.json([makeUser({ uid: "u1" })])),
  http.post(`${API}/users`, async ({ request }) => {
    const body = (await request.json()) as Partial<User> & { password?: string };
    const { password: _password, ...rest } = body;
    return HttpResponse.json(makeUser({ uid: "new-user-1", ...rest }));
  }),
  http.get(`${API}/users/:uid`, () => HttpResponse.json(makeUser({ uid: "u1" }))),
  http.put(`${API}/users/:uid`, () => HttpResponse.json(makeUser({ uid: "u1" }))),
  http.put(`${API}/users/:uid/photo`, () => HttpResponse.json({})),
  http.get(`${API}/incident-types`, () => HttpResponse.json([makeIncidentType({ uid: "type-1" })])),
  http.get(`${API}/incident-reports`, () => HttpResponse.json([])),
  http.post(`${API}/incident-reports`, () =>
    HttpResponse.json(makeIncidentReport({ uid: "report-1" })),
  ),
];
