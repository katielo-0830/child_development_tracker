import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("sessions", "routes/sessions/sessions.tsx"),
  route("sessions/:id", "routes/sessions/session.tsx"),
  route("sessions/new", "routes/sessions/new.tsx"),
  route("programs", "routes/programs/programs.tsx"),
  route("programs/new", "routes/programs/create_program.tsx"),
  route("program/:program_id", "routes/programs/program.tsx"),
  route("program/:program_id/stos/new", "routes/programs/create_sto.tsx"),
] satisfies RouteConfig;
