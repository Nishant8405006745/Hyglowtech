"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { ROLE_ADMIN, ROLE_MANAGER, ROLE_SUPER_ADMIN, ROLE_USER } from "@/lib/constants";
import { ApiError, apiJson } from "@/lib/api-client";
import type { EmployeeRow, RoleRow, UserRow } from "@/lib/types";

type Me = { id: number; name: string; email: string; role: string };

export function DashboardShell() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const loadMe = useCallback(async () => {
    setErr(null);
    try {
      const u = await apiJson<Me>("/auth/me");
      setMe(u);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) return;
      setErr(e instanceof ApiError ? e.message : "Could not load profile");
    }
  }, []);

  useEffect(() => {
    void loadMe();
  }, [loadMe]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  if (err && !me) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
        {err}
      </div>
    );
  }

  if (!me) {
    return <p className="text-zinc-500">Loading your workspace…</p>;
  }

  const isAdmin = me.role === ROLE_SUPER_ADMIN || me.role === ROLE_ADMIN;
  const isManager = me.role === ROLE_MANAGER;
  const isUser = me.role === ROLE_USER;

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Signed in as <span className="font-medium text-zinc-800 dark:text-zinc-200">{me.email}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <RoleBadge role={me.role} />
          <button
            type="button"
            onClick={() => void logout()}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Log out
          </button>
        </div>
      </header>

      {isAdmin ? <AdminSections /> : null}
      {isManager && !isAdmin ? <ManagerEmployeesSection /> : null}
      {isUser ? <UserWelcome me={me} /> : null}
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  return (
    <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-violet-800 dark:bg-violet-950 dark:text-violet-200">
      {role}
    </span>
  );
}

function UserWelcome({ me }: { me: Me }) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-lg font-medium text-zinc-900 dark:text-white">Your workspace</h2>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Hello, {me.name}. You have the <strong className="text-zinc-800 dark:text-zinc-200">User</strong> role. Contact an
        administrator if you need elevated access or employee assignments.
      </p>
    </section>
  );
}

function AdminSections() {
  return (
    <div className="space-y-12">
      <UsersAdminPanel />
      <EmployeesAdminPanel />
    </div>
  );
}

function UsersAdminPanel() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleName, setRoleName] = useState("User");

  const load = useCallback(async () => {
    setError(null);
    try {
      const [u, r] = await Promise.all([apiJson<UserRow[]>("/users"), apiJson<RoleRow[]>("/roles")]);
      setUsers(u);
      setRoles(r);
      setRoleName((prev) => (r.some((x) => x.role_name === prev) ? prev : (r[0]?.role_name ?? "User")));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load users");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function createUser(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await apiJson("/users", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          role_name: roleName,
        }),
      });
      setName("");
      setEmail("");
      setPassword("");
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Create failed");
    }
  }

  async function updateRole(userId: number, nextRole: string) {
    setError(null);
    try {
      await apiJson(`/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({ role_name: nextRole }),
      });
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Update failed");
    }
  }

  async function removeUser(userId: number) {
    if (!confirm("Delete this user?")) return;
    setError(null);
    try {
      await apiJson(`/users/${userId}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Delete failed");
    }
  }

  return (
    <section>
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Users</h2>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Super Admin and Admin can view and manage all accounts.</p>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}

      <form
        onSubmit={(e) => void createUser(e)}
        className="mt-6 grid gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50 sm:grid-cols-2"
      >
        <h3 className="sm:col-span-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">Invite user</h3>
        <input
          required
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950"
        />
        <input
          required
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950"
        />
        <input
          required
          type="password"
          placeholder="Temporary password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950"
        />
        <select
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950"
        >
          {roles.map((r) => (
            <option key={r.id} value={r.role_name}>
              {r.role_name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="sm:col-span-2 rounded-lg bg-violet-600 py-2 text-sm font-medium text-white hover:bg-violet-500"
        >
          Create user
        </button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-zinc-100 dark:bg-zinc-800/80">
            <tr>
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Email</th>
              <th className="px-4 py-2 font-medium">Role</th>
              <th className="px-4 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-zinc-200 dark:border-zinc-800">
                <td className="px-4 py-2">{u.name}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">
                  <select
                    value={u.role}
                    onChange={(e) => void updateRole(u.id, e.target.value)}
                    className="rounded border border-zinc-300 bg-white px-2 py-1 text-xs dark:border-zinc-600 dark:bg-zinc-950"
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.role_name}>
                        {r.role_name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-2">
                  <button
                    type="button"
                    onClick={() => void removeUser(u.id)}
                    className="text-xs font-medium text-red-600 hover:underline dark:text-red-400"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function EmployeesAdminPanel() {
  const [rows, setRows] = useState<EmployeeRow[]>([]);
  const [managers, setManagers] = useState<UserRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [managerId, setManagerId] = useState<string>("");

  const load = useCallback(async () => {
    setError(null);
    try {
      const [emps, users] = await Promise.all([apiJson<EmployeeRow[]>("/employees"), apiJson<UserRow[]>("/users")]);
      setRows(emps);
      setManagers(users.filter((u) => u.role === ROLE_MANAGER || u.role === ROLE_ADMIN || u.role === ROLE_SUPER_ADMIN));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load employees");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function createEmp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await apiJson("/employees", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          manager_id: managerId ? Number(managerId) : null,
        }),
      });
      setName("");
      setManagerId("");
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Create failed");
    }
  }

  async function updateEmp(id: number, patch: { name?: string; manager_id?: number | null }) {
    setError(null);
    try {
      await apiJson(`/employees/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Update failed");
    }
  }

  async function deleteEmp(id: number) {
    if (!confirm("Remove employee record?")) return;
    setError(null);
    try {
      await apiJson(`/employees/${id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Delete failed");
    }
  }

  return (
    <section>
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Employees</h2>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Assign managers by linking a User id (managers see their team).</p>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}

      <form
        onSubmit={(e) => void createEmp(e)}
        className="mt-6 flex flex-wrap items-end gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50"
      >
        <label className="flex flex-col text-xs font-medium text-zinc-600 dark:text-zinc-400">
          Name
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-48 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950"
          />
        </label>
        <label className="flex flex-col text-xs font-medium text-zinc-600 dark:text-zinc-400">
          Manager (optional)
          <select
            value={managerId}
            onChange={(e) => setManagerId(e.target.value)}
            className="mt-1 w-56 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950"
          >
            <option value="">— None —</option>
            {managers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.email})
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500">
          Add employee
        </button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-zinc-100 dark:bg-zinc-800/80">
            <tr>
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Manager user id</th>
              <th className="px-4 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <EmployeeRowEditor
                key={row.id}
                row={row}
                managers={managers}
                onSave={(patch) => void updateEmp(row.id, patch)}
                onDelete={() => void deleteEmp(row.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function EmployeeRowEditor({
  row,
  managers,
  onSave,
  onDelete,
}: {
  row: EmployeeRow;
  managers: UserRow[];
  onSave: (patch: { name?: string; manager_id?: number | null }) => void;
  onDelete: () => void;
}) {
  const [localName, setLocalName] = useState(row.name);
  const [localMgr, setLocalMgr] = useState(row.manager_id === null ? "" : String(row.manager_id));

  return (
    <tr className="border-t border-zinc-200 dark:border-zinc-800">
      <td className="px-4 py-2">
        <input
          value={localName}
          onChange={(e) => setLocalName(e.target.value)}
          className="w-full min-w-[8rem] rounded border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-950"
        />
      </td>
      <td className="px-4 py-2">
        <select
          value={localMgr}
          onChange={(e) => setLocalMgr(e.target.value)}
          className="rounded border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-950"
        >
          <option value="">— None —</option>
          {managers.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} (#{m.id})
            </option>
          ))}
        </select>
      </td>
      <td className="px-4 py-2 space-x-2">
        <button
          type="button"
          onClick={() =>
            onSave({
              name: localName.trim(),
              manager_id: localMgr === "" ? null : Number(localMgr),
            })
          }
          className="text-xs font-medium text-violet-600 hover:underline"
        >
          Save
        </button>
        <button type="button" onClick={onDelete} className="text-xs font-medium text-red-600 hover:underline dark:text-red-400">
          Delete
        </button>
      </td>
    </tr>
  );
}

function ManagerEmployeesSection() {
  const [rows, setRows] = useState<EmployeeRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");

  const load = useCallback(async () => {
    setError(null);
    try {
      const emps = await apiJson<EmployeeRow[]>("/employees");
      setRows(emps);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load team");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await apiJson("/employees", {
        method: "POST",
        body: JSON.stringify({ name: name.trim(), manager_id: null }),
      });
      setName("");
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not add employee");
    }
  }

  async function saveRow(id: number, nextName: string) {
    setError(null);
    try {
      await apiJson(`/employees/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ name: nextName.trim() }),
      });
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Update failed");
    }
  }

  async function del(id: number) {
    if (!confirm("Remove from your team?")) return;
    setError(null);
    try {
      await apiJson(`/employees/${id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Delete failed");
    }
  }

  return (
    <section>
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Your team</h2>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Employees assigned to you as manager.</p>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}

      <form onSubmit={(e) => void add(e)} className="mt-6 flex flex-wrap gap-4">
        <input
          required
          placeholder="Employee name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950"
        />
        <button type="submit" className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500">
          Add direct report
        </button>
      </form>

      <ul className="mt-6 divide-y divide-zinc-200 rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
        {rows.length === 0 ? (
          <li className="px-4 py-6 text-sm text-zinc-500">No employees assigned yet.</li>
        ) : (
          rows.map((r) => (
            <ManagerEmployeeLine key={r.id} row={r} onSave={(n) => void saveRow(r.id, n)} onDelete={() => void del(r.id)} />
          ))
        )}
      </ul>
    </section>
  );
}

function ManagerEmployeeLine({
  row,
  onSave,
  onDelete,
}: {
  row: EmployeeRow;
  onSave: (name: string) => void;
  onDelete: () => void;
}) {
  const [n, setN] = useState(row.name);
  return (
    <li className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <input
        value={n}
        onChange={(e) => setN(e.target.value)}
        className="flex-1 rounded border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-950"
      />
      <div className="flex gap-2">
        <button type="button" onClick={() => onSave(n)} className="text-sm font-medium text-violet-600 hover:underline">
          Save
        </button>
        <button type="button" onClick={onDelete} className="text-sm font-medium text-red-600 hover:underline dark:text-red-400">
          Remove
        </button>
      </div>
    </li>
  );
}
