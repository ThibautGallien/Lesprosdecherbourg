// app/api/auth/cms-login/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // Récupérer les credentials depuis les variables d'environnement
    const validUsername = process.env.CMS_USERNAME || "admin";
    const validPassword = process.env.CMS_PASSWORD || "admin123";

    // Vérifier les credentials
    if (username === validUsername && password === validPassword) {
      return NextResponse.json({
        success: true,
        message: "Connexion réussie",
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Identifiants incorrects",
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Erreur API login:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur",
      },
      { status: 500 }
    );
  }
}
