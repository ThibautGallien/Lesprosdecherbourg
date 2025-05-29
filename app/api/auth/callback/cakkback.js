export default async function handler(req, res) {
  const { code } = req.query;

  console.log("🔐 Auth callback reçu, code:", code ? "OUI" : "NON");

  if (!code) {
    console.log("❌ Pas de code fourni");
    return res.status(400).json({ error: "No code provided" });
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
      return res.redirect(redirectUrl);
    } else {
      console.log("❌ Échec obtention token:", data);
      return res.status(400).json({
        error: "Failed to get access token",
        details: data,
      });
    }
  } catch (error) {
    console.log("💥 Erreur auth:", error);
    return res.status(500).json({
      error: "Authentication failed",
      details: error.message,
    });
  }
}
