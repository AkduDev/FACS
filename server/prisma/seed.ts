import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const INITIAL_GALLERY = [
  {
    id: "g1",
    url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    title: "Arrecife de Coral en Jardines de la Reina",
    description: "Uno de los ecosistemas marinos mejor preservados del Caribe, con abundante coral cuerno de alce y peces tropicales.",
    category: "flora",
    date: "2026-05-12",
  },
  {
    id: "g2",
    url: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&w=800&q=80",
    title: "Buceador en Bahía de Cochinos",
    description: "Explorando las famosas paredes de buceo que caen a cientos de metros, a pocos metros de la orilla.",
    category: "entrenamiento",
    date: "2026-06-01",
  },
  {
    id: "g3",
    url: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=800&q=80",
    title: "Tiburón Sedoso en el Archipiélago del Sur",
    description: "Encuentro cercano con la magnífica fauna pelágica que caracteriza a las aguas profundas de Cuba.",
    category: "fauna",
    date: "2026-04-20",
  },
  {
    id: "g4",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    title: "Explorando el Barco Hundido en Varadero",
    description: "Buceo de naufragio en el parque marino Cayo Piedras del Norte, un paraíso de arrecifes artificiales.",
    category: "naufragios",
    date: "2026-03-15",
  },
  {
    id: "g5",
    url: "https://images.unsplash.com/photo-1682687220199-d0124f48f95b?auto=format&fit=crop&w=800&q=80",
    title: "Cuevas Sumergidas de Ciénaga de Zapata",
    description: "Buceo en cenotes y sistemas de cuevas inundadas (casimbas), un desafío para buceadores avanzados.",
    category: "paisaje",
    date: "2026-05-28",
  },
];

const INITIAL_NEWS = [
  {
    id: "n1",
    title: "Campaña de Conservación del Coral Negro en María la Gorda",
    content: "La FCAS, en colaboración con el Centro de Investigaciones Marinas de la Universidad de La Habana, ha iniciado un programa de monitoreo y reforestación de corales negros en el Parque Nacional Península de Guanahacabibes. El objetivo es restaurar áreas afectadas por el cambio climático e instruir a los centros de buceo locales en prácticas ecosostenibles.",
    date: "2026-06-25",
    image: "https://images.unsplash.com/photo-1464802686167-b939a6910659?auto=format&fit=crop&w=800&q=80",
    author: "Comité Científico FCAS",
    category: "conservacion",
  },
  {
    id: "n2",
    title: "Exitoso Encuentro Nacional de Fotografía Subacuática FOTOSUB 2026",
    content: "Con la participación de más de 40 fotógrafos y videógrafos de todo el país, concluyó en Cayo Largo del Sur la edición número 18 del campeonato nacional. Los ganadores representarán a Cuba en los próximos eventos internacionales auspiciados por la CMAS (Confederación Mundial de Actividades Subacuáticas). El nivel técnico demostrado reafirma el prestigio de nuestra escuela de fotografía submarina.",
    date: "2026-05-18",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    author: "Secretaría de Prensa",
    category: "federacion",
  },
  {
    id: "n3",
    title: "Nuevos Estándares de Seguridad para Operadoras turísticas de Buceo",
    content: "A partir de este mes, entran en vigor las nuevas regulaciones conjuntas entre el Ministerio de Turismo y la FCAS. El documento actualiza los protocolos de primeros auxilios, mantenimiento de cámaras hiperbáricas y requisitos de certificación mínima para los Divemasters a cargo de grupos comerciales en todo el archipiélago cubano.",
    date: "2026-04-10",
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80",
    author: "Comisión de Buceo Seguro",
    category: "seguridad",
  },
];

const INITIAL_EVENTS = [
  {
    id: "e1",
    title: "Jornada Nacional de Limpieza de Fondos Marinos",
    date: "2026-07-25",
    location: "Playas del Este, La Habana",
    description: "Gran convocatoria para buceadores certificados y voluntarios locales. Nos uniremos para retirar plásticos y artes de pesca abandonadas en el arrecife costero de Guanabo. Habrá tanques y recargas gratuitas para los buzos registrados.",
    category: "limpieza",
    image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "e2",
    title: "Curso de Especialidad: Arqueología Marina y Naufragios del Caribe",
    date: "2026-08-14",
    location: "Sede FCAS, Santiago de Cuba",
    description: "Impartido por especialistas de la Oficina del Conservador de la Ciudad de Santiago de Cuba. Estudiaremos la historia y técnicas de documentación de los pecios de la Batalla Naval de Santiago de Cuba (1898). Requisito: Dos Estrellas CMAS o equivalente.",
    category: "curso",
    image: "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "e3",
    title: "Campeonato Nacional de Apnea y Pesca Sostenible",
    date: "2026-09-05",
    location: "Cayo Coco, Ciego de Ávila",
    description: "Competencia nacional regulada bajo normas estrictas de conservación marina y tallas mínimas. Incluye disciplinas de apnea estática, dinámica y peso constante, promoviendo la actividad de pulmón libre de manera respetuosa.",
    category: "competicion",
    image: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=800&q=80",
  },
];

const INITIAL_INSTRUCTORS = [
  {
    id: "i1",
    name: 'Alejandro "El Capi" Silva',
    bio: "Buzo profesional con más de 30 años de experiencia en la Marina de Guerra y el turismo internacional. Instructor Tres Estrellas CMAS y experto en buceo profundo y rescate. Ha cartografiado múltiples cuevas en la Península de Zapata.",
    level: "Instructor de Buceo de 3 Estrellas CMAS",
    certificationCode: "CUB-INST-042",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    experienceYears: 32,
  },
  {
    id: "i2",
    name: "Dra. Mayra González",
    bio: "Bióloga marina y especialista en conservación de arrecifes. Combina la docencia científica universitaria con la instrucción de buceo de dos estrellas. Diseñó el manual de ecología subacuática oficial de la FCAS.",
    level: "Instructor Científico de 2 Estrellas",
    certificationCode: "CUB-INST-115",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
    experienceYears: 18,
  },
  {
    id: "i3",
    name: "Carlos Manuel Betancourt",
    bio: "Instructor especialista en Nitrox, buceo técnico y trimix. Apasionado por la arqueología submarina e instructor principal en el área oriental del país. Ganador de múltiples premios nacionales de fotografía submarina.",
    level: "Instructor de Especialidades Técnicas",
    certificationCode: "CUB-INST-089",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    experienceYears: 22,
  },
];

const INITIAL_GRADUATES = [
  {
    id: "grad1",
    name: "Ernesto Pérez Alonso",
    certificationCode: "FCAS-OW-2026-004",
    courseName: "Open Water Diver (1 Estrella)",
    graduationDate: "2026-02-14",
    instructorName: 'Alejandro "El Capi" Silva',
    level: "1-star",
  },
  {
    id: "grad2",
    name: "Laura Méndez Rojas",
    certificationCode: "FCAS-ADV-2026-012",
    courseName: "Advanced Open Water (2 Estrellas)",
    graduationDate: "2026-05-10",
    instructorName: "Dra. Mayra González",
    level: "2-star",
  },
  {
    id: "grad3",
    name: "Yusniel Torres Guerra",
    certificationCode: "FCAS-DM-2025-081",
    courseName: "Divemaster FCAS",
    graduationDate: "2025-11-20",
    instructorName: "Carlos Manuel Betancourt",
    level: "divemaster",
  },
  {
    id: "grad4",
    name: "Dianet Carrazana Gil",
    certificationCode: "FCAS-RES-2026-019",
    courseName: "Buceador de Rescate y Salvamento",
    graduationDate: "2026-06-18",
    instructorName: 'Alejandro "El Capi" Silva',
    level: "3-star",
  },
  {
    id: "grad5",
    name: "Mauricio Blanco Díaz",
    certificationCode: "FCAS-OW-2026-023",
    courseName: "Open Water Diver (1 Estrella)",
    graduationDate: "2026-06-30",
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
      id: "admin-1",
      username: "admin",
      password: hashedPassword,
    },
  });

  for (const item of INITIAL_GALLERY) {
    await prisma.gallery.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }

  for (const item of INITIAL_NEWS) {
    await prisma.news.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }

  for (const item of INITIAL_EVENTS) {
    await prisma.event.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }

  for (const item of INITIAL_INSTRUCTORS) {
    await prisma.instructor.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }

  for (const item of INITIAL_GRADUATES) {
    await prisma.graduate.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
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
