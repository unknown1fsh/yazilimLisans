"use client";
export default function LogoutButton() {
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.reload();
  };
  return (
    <button onClick={logout} className="rounded bg-gray-200 px-3 py-2 text-sm hover:bg-gray-300 dark:bg-neutral-800 dark:hover:bg-neutral-700">
      Çıkış
    </button>
  );
}


