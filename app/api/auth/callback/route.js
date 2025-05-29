import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  console.log("🔐 Auth callback reçu, code:", code ? "OUI" : "NON");

  if (!code) {
    console.log("❌ Pas de code fourni");
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  try {
    console.log("🌐 Échange du code contre un token...");

    const response = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        }),
      }
    );

    const data = await response.json();
    console.log(
      "📋 Réponse GitHub:",
      data.access_token ? "Token reçu" : "Erreur"
    );

    if (data.access_token) {
      const redirectUrl = `${process.env.NEXTAUTH_URL}/admin/#access_token=${data.access_token}&token_type=bearer`;
      console.log("✅ Redirection vers le CMS");
      return NextResponse.redirect(redirectUrl);
    } else {
      console.log("❌ Échec obtention token:", data);
      return NextResponse.json(
        { error: "Failed to get access token", details: data },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log("💥 Erreur auth:", error);
    return NextResponse.json(
      { error: "Authentication failed", details: error.message },
      { status: 500 }
    );
  }
}

// Support pour les requêtes POST aussi (au cas où)
export async function POST(request) {
  return GET(request);
}
