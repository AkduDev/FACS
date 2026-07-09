import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function addLocalImageColumns() {
  console.log("Adding localImage columns to existing tables...");

  // Agregar columna localImage a Gallery
  try {
    await prisma.$executeRawUnsafe(
      "ALTER TABLE Gallery ADD COLUMN localImage TEXT"
    );
    console.log("✅ Added localImage column to Gallery table");
  } catch (error: any) {
    if (error.message.includes("already exists")) {
      console.log("ℹ️ localImage column already exists in Gallery table");
    } else {
      console.error("❌ Error adding localImage to Gallery:", error.message);
    }
  }

  // Agregar columna localImage a News
  try {
    await prisma.$executeRawUnsafe(
      "ALTER TABLE News ADD COLUMN localImage TEXT"
    );
    console.log("✅ Added localImage column to News table");
  } catch (error: any) {
    if (error.message.includes("already exists")) {
      console.log("ℹ️ localImage column already exists in News table");
    } else {
      console.error("❌ Error adding localImage to News:", error.message);
    }
  }

  // Agregar columna localImage a Event
  try {
    await prisma.$executeRawUnsafe(
      "ALTER TABLE Event ADD COLUMN localImage TEXT"
    );
    console.log("✅ Added localImage column to Event table");
  } catch (error: any) {
    if (error.message.includes("already exists")) {
      console.log("ℹ️ localImage column already exists in Event table");
    } else {
      console.error("❌ Error adding localImage to Event:", error.message);
    }
  }

  // Agregar columna localPhoto a Instructor
  try {
    await prisma.$executeRawUnsafe(
      "ALTER TABLE Instructor ADD COLUMN localPhoto TEXT"
    );
    console.log("✅ Added localPhoto column to Instructor table");
  } catch (error: any) {
    if (error.message.includes("already exists")) {
      console.log("ℹ️ localPhoto column already exists in Instructor table");
    } else {
      console.error("❌ Error adding localPhoto to Instructor:", error.message);
    }
  }

  console.log("\nMigration completed!");
}

addLocalImageColumns()
  .catch((e) => {
    console.error("Migration failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
