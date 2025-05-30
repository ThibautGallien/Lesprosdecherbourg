// app/api/auth/cms-login/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // DEBUG: Ajoutez ces logs
    console.log("🔐 Tentative de connexion reçue:", { username, password });
    console.log("🔧 Variables env:", {
      envUsername: process.env.CMS_USERNAME,
      envPassword: process.env.CMS_PASSWORD,
    });

    const validUsername = process.env.CMS_USERNAME || "admin";
    const validPassword = process.env.CMS_PASSWORD || "admin123";

    console.log("📋 Comparaison:", { validUsername, validPassword });

    if (username === validUsername && password === validPassword) {
      console.log("✅ Connexion autorisée");
      return NextResponse.json({ success: true, message: "Connexion réussie" });
    } else {
      console.log("❌ Connexion refusée");
      return NextResponse.json(
        { success: false, message: "Identifiants incorrects" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("💥 Erreur API login:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}
