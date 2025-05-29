import { NextResponse } from "next/server";

// Configuration ActiveCampaign
const AC_BASE_URL = process.env.ACTIVECAMPAIGN_BASE_URL; // ex: https://votre-compte.api-us1.com
const AC_API_KEY = process.env.ACTIVECAMPAIGN_API_KEY;

export async function POST(request) {
  try {
    const { email, source = "website", tags = [] } = await request.json();

    // Validation de l'email
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    // Vérification des variables d'environnement
    if (!AC_BASE_URL || !AC_API_KEY) {
      console.error("Variables ActiveCampaign manquantes");
      return NextResponse.json(
        { error: "Configuration ActiveCampaign manquante" },
        { status: 500 }
      );
    }

    // 1. Créer/Mettre à jour le contact
    const contactResponse = await fetch(`${AC_BASE_URL}/api/3/contacts`, {
      method: "POST",
      headers: {
        "Api-Token": AC_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contact: {
          email: email,
          fieldValues: [
            {
              field: "1", // Champ source (à adapter selon votre config)
              value: source,
            },
          ],
        },
      }),
    });

    const contactData = await contactResponse.json();

    if (!contactResponse.ok) {
      console.error("Erreur ActiveCampaign contact:", contactData);
      return NextResponse.json(
        { error: "Erreur lors de l'ajout du contact" },
        { status: 500 }
      );
    }

    const contactId = contactData.contact.id;

    // 2. Ajouter les tags si fournis
    if (tags.length > 0) {
      for (const tagName of tags) {
        try {
          // Chercher si le tag existe
          const tagResponse = await fetch(
            `${AC_BASE_URL}/api/3/tags?search=${encodeURIComponent(tagName)}`,
            {
              headers: {
                "Api-Token": AC_API_KEY,
              },
            }
          );

          const tagData = await tagResponse.json();
          let tagId;

          if (tagData.tags && tagData.tags.length > 0) {
            tagId = tagData.tags[0].id;
          } else {
            // Créer le tag s'il n'existe pas
            const createTagResponse = await fetch(`${AC_BASE_URL}/api/3/tags`, {
              method: "POST",
              headers: {
                "Api-Token": AC_API_KEY,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                tag: {
                  tag: tagName,
                  tagType: "contact",
                },
              }),
            });

            const createTagData = await createTagResponse.json();
            tagId = createTagData.tag.id;
          }

          // Associer le tag au contact
          await fetch(`${AC_BASE_URL}/api/3/contactTags`, {
            method: "POST",
            headers: {
              "Api-Token": AC_API_KEY,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contactTag: {
                contact: contactId,
                tag: tagId,
              },
            }),
          });
        } catch (tagError) {
          console.error("Erreur tag:", tagError);
          // Continue même si les tags échouent
        }
      }
    }

    // 3. Optionnel: Ajouter à une liste spécifique
    const LIST_ID = process.env.ACTIVECAMPAIGN_LIST_ID; // ID de votre liste newsletter

    if (LIST_ID) {
      await fetch(`${AC_BASE_URL}/api/3/contactLists`, {
        method: "POST",
        headers: {
          "Api-Token": AC_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contactList: {
            list: LIST_ID,
            contact: contactId,
            status: 1, // 1 = actif, 2 = désabonné
          },
        }),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Inscription réussie",
      contactId: contactId,
    });
  } catch (error) {
    console.error("Erreur API newsletter:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de l'inscription" },
      { status: 500 }
    );
  }
}
