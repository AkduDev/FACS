import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const INITIAL_GALLERY = [
  {
    url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    title: "Arrecife de Coral en Jardines de la Reina",
    titleEn: "Coral Reef in Gardens of the Queen",
    description: "Uno de los ecosistemas marinos mejor preservados del Caribe, con abundante coral cuerno de alce y peces tropicales.",
    descriptionEn: "One of the best-preserved marine ecosystems in the Caribbean, with abundant staghorn coral and tropical fish.",
    category: "flora",
    categoryEn: "Flora & Coral",
    date: new Date("2026-05-12"),
  },
  {
    url: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&w=800&q=80",
    title: "Buceador en Bahía de Cochinos",
    titleEn: "Diver in Bay of Pigs",
    description: "Explorando las famosas paredes de buceo que caen a cientos de metros, a pocos metros de la orilla.",
    descriptionEn: "Exploring the famous dive walls that drop hundreds of meters, just meters from shore.",
    category: "entrenamiento",
    categoryEn: "Training",
    date: new Date("2026-06-01"),
  },
  {
    url: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=800&q=80",
    title: "Tiburón Sedoso en el Archipiélago del Sur",
    titleEn: "Silky Shark in the Southern Archipelago",
    description: "Encuentro cercano con la magnífica fauna pelágica que caracteriza a las aguas profundas de Cuba.",
    descriptionEn: "Close encounter with the magnificent pelagic fauna that characterizes Cuba's deep waters.",
    category: "fauna",
    categoryEn: "Marine Fauna",
    date: new Date("2026-04-20"),
  },
  {
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    title: "Explorando el Barco Hundido en Varadero",
    titleEn: "Exploring the Shipwreck in Varadero",
    description: "Buceo de naufragio en el parque marino Cayo Piedras del Norte, un paraíso de arrecifes artificiales.",
    descriptionEn: "Wreck diving at Cayo Piedras del Norte marine park, an artificial reef paradise.",
    category: "naufragios",
    categoryEn: "Shipwrecks",
    date: new Date("2026-03-15"),
  },
  {
    url: "https://images.unsplash.com/photo-1682687220199-d0124f48f95b?auto=format&fit=crop&w=800&q=80",
    title: "Cuevas Sumergidas de Ciénaga de Zapata",
    titleEn: "Submerged Caves of Ciénaga de Zapata",
    description: "Buceo en cenotes y sistemas de cuevas inundadas (casimbas), un desafío para buceadores avanzados.",
    descriptionEn: "Diving in cenotes and flooded cave systems (casimbas), a challenge for advanced divers.",
    category: "paisaje",
    categoryEn: "Seascape",
    date: new Date("2026-05-28"),
  },
];

const INITIAL_NEWS = [
  {
    title: "Campaña de Conservación del Coral Negro en María la Gorda",
    titleEn: "Black Coral Conservation Campaign in María la Gorda",
    content: "La FCAS, en colaboración con el Centro de Investigaciones Marinas de la Universidad de La Habana, ha iniciado un programa de monitoreo y reforestación de corales negros en el Parque Nacional Península de Guanahacabibes. El objetivo es restaurar áreas afectadas por el cambio climático e instruir a los centros de buceo locales en prácticas ecosostenibles.",
    contentEn: "FCAS, in collaboration with the Marine Research Center of the University of Havana, has launched a monitoring and reforestation program for black corals in the Guanahacabibes Peninsula National Park. The goal is to restore areas affected by climate change and train local diving centers in eco-sustainable practices.",
    date: new Date("2026-06-25"),
    image: "https://images.unsplash.com/photo-1464802686167-b939a6910659?auto=format&fit=crop&w=800&q=80",
    author: "Comité Científico FCAS",
    category: "conservacion",
    categoryEn: "Conservation",
  },
  {
    title: "Exitoso Encuentro Nacional de Fotografía Subacuática FOTOSUB 2026",
    titleEn: "Successful National Underwater Photography Meeting FOTOSUB 2026",
    content: "Con la participación de más de 40 fotógrafos y videógrafos de todo el país, concluyó en Cayo Largo del Sur la edición número 18 del campeonato nacional. Los ganadores representarán a Cuba en los próximos eventos internacionales auspiciados por la CMAS (Confederación Mundial de Actividades Subacuáticas). El nivel técnico demostrado reafirma el prestigio de nuestra escuela de fotografía submarina.",
    contentEn: "With the participation of more than 40 photographers and videographers from across the country, the 18th edition of the national championship concluded in Cayo Largo del Sur. The winners will represent Cuba in upcoming international events sponsored by CMAS (World Confederation of Underwater Activities). The demonstrated technical level reaffirms the prestige of our underwater photography school.",
    date: new Date("2026-05-18"),
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    author: "Secretaría de Prensa",
    category: "federacion",
    categoryEn: "Federation",
  },
  {
    title: "Nuevos Estándares de Seguridad para Operadoras turísticas de Buceo",
    titleEn: "New Safety Standards for Dive Tourism Operators",
    content: "A partir de este mes, entran en vigor las nuevas regulaciones conjuntas entre el Ministerio de Turismo y la FCAS. El documento actualiza los protocolos de primeros auxilios, mantenimiento de cámaras hiperbáricas y requisitos de certificación mínima para los Divemasters a cargo de grupos comerciales en todo el archipiélago cubano.",
    contentEn: "Starting this month, new joint regulations between the Ministry of Tourism and FCAS come into effect. The document updates first aid protocols, hyperbaric chamber maintenance, and minimum certification requirements for Divemasters in charge of commercial groups throughout the Cuban archipelago.",
    date: new Date("2026-04-10"),
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80",
    author: "Comisión de Buceo Seguro",
    category: "seguridad",
    categoryEn: "Safety",
  },
];

const INITIAL_EVENTS = [
  {
    title: "Jornada Nacional de Limpieza de Fondos Marinos",
    titleEn: "National Seabed Cleanup Day",
    date: new Date("2026-07-25"),
    location: "Playas del Este, La Habana",
    locationEn: "Eastern Beaches, Havana",
    description: "Gran convocatoria para buceadores certificados y voluntarios locales. Nos uniremos para retirar plásticos y artes de pesca abandonadas en el arrecife costero de Guanabo. Habrá tanques y recargas gratuitas para los buzos registrados.",
    descriptionEn: "Major gathering for certified divers and local volunteers. We will join forces to remove plastics and abandoned fishing gear from the Guanabo coastal reef. Free tanks and refills for registered divers.",
    category: "limpieza",
    categoryEn: "Ecological",
    image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Curso de Especialidad: Arqueología Marina y Naufragios del Caribe",
    titleEn: "Specialty Course: Maritime Archaeology & Caribbean Shipwrecks",
    date: new Date("2026-08-14"),
    location: "Sede FCAS, Santiago de Cuba",
    locationEn: "FCAS Headquarters, Santiago de Cuba",
    description: "Impartido por especialistas de la Oficina del Conservador de la Ciudad de Santiago de Cuba. Estudiaremos la historia y técnicas de documentación de los pecios de la Batalla Naval de Santiago de Cuba (1898). Requisito: Dos Estrellas CMAS o equivalente.",
    descriptionEn: "Taught by specialists from the Office of the City Conservator of Santiago de Cuba. We will study the history and documentation techniques of wrecks from the Naval Battle of Santiago de Cuba (1898). Requirement: Two Stars CMAS or equivalent.",
    category: "curso",
    categoryEn: "Course / Workshop",
    image: "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Campeonato Nacional de Apnea y Pesca Sostenible",
    titleEn: "National Apnea & Sustainable Fishing Championship",
    date: new Date("2026-09-05"),
    location: "Cayo Coco, Ciego de Ávila",
    locationEn: "Cayo Coco, Ciego de Ávila",
    description: "Competencia nacional regulada bajo normas estrictas de conservación marina y tallas mínimas. Incluye disciplinas de apnea estática, dinámica y peso constante, promoviendo la actividad de pulmón libre de manera respetuosa.",
    descriptionEn: "National competition regulated under strict marine conservation and minimum size standards. Includes static apnea, dynamic, and constant weight disciplines, promoting freediving in a respectful manner.",
    category: "competicion",
    categoryEn: "Competition",
    image: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=800&q=80",
  },
];

const INITIAL_INSTRUCTORS = [
  {
    name: 'Alejandro "El Capi" Silva',
    bio: "Buzo profesional con más de 30 años de experiencia en la Marina de Guerra y el turismo internacional. Instructor Tres Estrellas CMAS y experto en buceo profundo y rescate. Ha cartografiado múltiples cuevas en la Península de Zapata.",
    bioEn: "Professional diver with over 30 years of experience in the Navy and international tourism. Three-Star CMAS Instructor and expert in deep diving and rescue. Has mapped multiple caves in the Zapata Peninsula.",
    level: "Instructor de Buceo de 3 Estrellas CMAS",
    levelEn: "3-Star CMAS Diving Instructor",
    certificationCode: "CUB-INST-042",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    experienceYears: 32,
  },
  {
    name: "Dra. Mayra González",
    bio: "Bióloga marina y especialista en conservación de arrecifes. Combina la docencia científica universitaria con la instrucción de buceo de dos estrellas. Diseñó el manual de ecología subacuática oficial de la FCAS.",
    bioEn: "Marine biologist and reef conservation specialist. Combines university scientific teaching with two-star dive instruction. Designed the official FCAS underwater ecology manual.",
    level: "Instructor Científico de 2 Estrellas",
    levelEn: "2-Star Scientific Instructor",
    certificationCode: "CUB-INST-115",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
    experienceYears: 18,
  },
  {
    name: "Carlos Manuel Betancourt",
    bio: "Instructor especialista en Nitrox, buceo técnico y trimix. Apasionado por la arqueología submarina e instructor principal en el área oriental del país. Ganador de múltiples premios nacionales de fotografía submarina.",
    bioEn: "Instructor specializing in Nitrox, technical diving, and trimix. Passionate about underwater archaeology and lead instructor in the eastern region of the country. Winner of multiple national underwater photography awards.",
    level: "Instructor de Especialidades Técnicas",
    levelEn: "Technical Specialties Instructor",
    certificationCode: "CUB-INST-089",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    experienceYears: 22,
  },
];

const INITIAL_GRADUATES = [
  {
    name: "Ernesto Pérez Alonso",
    certificationCode: "FCAS-OW-2026-004",
    courseName: "Open Water Diver (1 Estrella)",
    graduationDate: new Date("2026-02-14"),
    instructorName: 'Alejandro "El Capi" Silva',
    level: "1-star",
  },
  {
    name: "Laura Méndez Rojas",
    certificationCode: "FCAS-ADV-2026-012",
    courseName: "Advanced Open Water (2 Estrellas)",
    graduationDate: new Date("2026-05-10"),
    instructorName: "Dra. Mayra González",
    level: "2-star",
  },
  {
    name: "Yusniel Torres Guerra",
    certificationCode: "FCAS-DM-2025-081",
    courseName: "Divemaster FCAS",
    graduationDate: new Date("2025-11-20"),
    instructorName: "Carlos Manuel Betancourt",
    level: "divemaster",
  },
  {
    name: "Dianet Carrazana Gil",
    certificationCode: "FCAS-RES-2026-019",
    courseName: "Buceador de Rescate y Salvamento",
    graduationDate: new Date("2026-06-18"),
    instructorName: 'Alejandro "El Capi" Silva',
    level: "3-star",
  },
  {
    name: "Mauricio Blanco Díaz",
    certificationCode: "FCAS-OW-2026-023",
    courseName: "Open Water Diver (1 Estrella)",
    graduationDate: new Date("2026-06-30"),
    instructorName: "Dra. Mayra González",
    level: "1-star",
  },
];

async function main() {
  console.log("Seeding database...");

  const adminPassword = process.env.ADMIN_PASSWORD || "fcas2026";
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { username: "admin" },
    update: { password: hashedPassword },
    create: {
      username: "admin",
      password: hashedPassword,
    },
  });

  for (const item of INITIAL_GALLERY) {
    const existing = await prisma.gallery.findFirst({ where: { title: item.title } });
    if (existing) {
      await prisma.gallery.update({ where: { id: existing.id }, data: item });
    } else {
      await prisma.gallery.create({ data: item });
    }
  }

  for (const item of INITIAL_NEWS) {
    const existing = await prisma.news.findFirst({ where: { title: item.title } });
    if (existing) {
      await prisma.news.update({ where: { id: existing.id }, data: item });
    } else {
      await prisma.news.create({ data: item });
    }
  }

  for (const item of INITIAL_EVENTS) {
    const existing = await prisma.event.findFirst({ where: { title: item.title } });
    if (existing) {
      await prisma.event.update({ where: { id: existing.id }, data: item });
    } else {
      await prisma.event.create({ data: item });
    }
  }

  for (const item of INITIAL_INSTRUCTORS) {
    const existing = await prisma.instructor.findFirst({ where: { certificationCode: item.certificationCode } });
    if (existing) {
      await prisma.instructor.update({ where: { id: existing.id }, data: item });
    } else {
      await prisma.instructor.create({ data: item });
    }
  }

  for (const item of INITIAL_GRADUATES) {
    const existing = await prisma.graduate.findFirst({ where: { certificationCode: item.certificationCode } });
    if (existing) {
      await prisma.graduate.update({ where: { id: existing.id }, data: item });
    } else {
      await prisma.graduate.create({ data: item });
    }
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
