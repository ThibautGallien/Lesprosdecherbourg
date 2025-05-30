// app/api/upload/images/route.js
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(request) {
  console.log("🖼️ DEBUT Upload d'images");

  try {
    const data = await request.formData();
    const files = data.getAll("images");

    console.log(`📁 ${files.length} fichier(s) reçu(s)`);

    if (!files || files.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Aucun fichier reçu",
        },
        { status: 400 }
      );
    }

    // Créer le dossier images s'il n'existe pas
    const uploadsDir = join(process.cwd(), "public/images");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
      console.log("📂 Dossier /public/images créé");
    }

    const uploadedFiles = [];

    for (const file of files) {
      console.log(`🔍 Traitement: ${file.name}`);

      // Vérifications
      if (!file.type.startsWith("image/")) {
        console.log(`❌ ${file.name} n'est pas une image`);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB max
        console.log(`❌ ${file.name} trop volumineux (${file.size} bytes)`);
        continue;
      }

      // Générer nom unique
      const timestamp = Date.now();
      const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const fileName = `${timestamp}-${originalName}`;

      // Sauvegarder le fichier
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filePath = join(uploadsDir, fileName);

      await writeFile(filePath, buffer);

      const uploadedFile = {
        id: timestamp + Math.random(),
        filename: fileName,
        originalName: file.name,
        url: `/images/${fileName}`,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
      };

      uploadedFiles.push(uploadedFile);
      console.log(`✅ ${fileName} sauvegardé`);
    }

    console.log(`🎉 ${uploadedFiles.length} image(s) uploadée(s) avec succès`);

    return NextResponse.json({
      success: true,
      message: `${uploadedFiles.length} image(s) uploadée(s)`,
      files: uploadedFiles,
    });
  } catch (error) {
    console.error("💥 Erreur upload:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors de l'upload",
      },
      { status: 500 }
    );
  }
}

// Lister les images existantes
export async function GET() {
  console.log("📋 Liste des images existantes");

  try {
    const uploadsDir = join(process.cwd(), "public/images");

    if (!existsSync(uploadsDir)) {
      return NextResponse.json({
        success: true,
        files: [],
      });
    }

    const { readdir, stat } = await import("fs/promises");
    const files = await readdir(uploadsDir);

    const imageFiles = [];

    for (const file of files) {
      const filePath = join(uploadsDir, file);
      const stats = await stat(filePath);

      if (stats.isFile() && /\.(jpg|jpeg|png|gif|webp)$/i.test(file)) {
        imageFiles.push({
          id: file,
          filename: file,
          url: `/images/${file}`,
          size: stats.size,
          uploadedAt: stats.mtime.toISOString(),
        });
      }
    }

    // Trier par date (plus récent d'abord)
    imageFiles.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    console.log(`📸 ${imageFiles.length} image(s) trouvée(s)`);

    return NextResponse.json({
      success: true,
      files: imageFiles,
    });
  } catch (error) {
    console.error("💥 Erreur listing:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors du listing",
      },
      { status: 500 }
    );
  }
}
