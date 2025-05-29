"use client";

import { useEffect } from "react";

export default function AdminRedirect() {
  useEffect(() => {
    // Redirection vers l'interface admin
    window.location.href = "/admin/index.html";
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">
          Redirection vers l'administration...
        </h1>
        <p>
          Si la redirection ne fonctionne pas,{" "}
          <a href="/admin/index.html" className="text-blue-600 hover:underline">
            cliquez ici
          </a>
        </p>
      </div>
    </div>
  );
}
