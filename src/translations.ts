export interface TranslationDict {
  // Common
  appName: string;
  appSub: string;
  adminPanel: string;
  logout: string;
  login: string;
  backToPublic: string;
  contactFcas: string;
  verified: string;
  all: string;
  date: string;
  category: string;
  actions: string;
  cancel: string;
  save: string;
  add: string;
  edit: string;
  delete: string;
  loading: string;

  // Navbar
  navHome: string;
  navGallery: string;
  navNews: string;
  navEvents: string;
  navInstructors: string;
  navGraduates: string;
  navAdminPanel: string;

  // Hero Section
  heroTitle: string;
  heroSub: string;
  heroBtnGraduates: string;
  heroBtnLearnMore: string;

  // Mission/Vision
  missionTitle: string;
  missionDesc: string;
  ecoTitle: string;
  ecoDesc: string;
  certTitle: string;
  certDesc: string;

  // Destinations
  destinationsTitle: string;
  destinationsSub: string;
  mariaLaGordaTitle: string;
  mariaLaGordaDesc: string;
  jardinesTitle: string;
  jardinesDesc: string;
  bahiaCochinosTitle: string;
  bahiaCochinosDesc: string;

  // Gallery
  galleryTitle: string;
  gallerySub: string;
  catFauna: string;
  catFlora: string;
  catNaufragios: string;
  catEntrenamiento: string;
  catPaisaje: string;

  // News
  newsTitle: string;
  newsSub: string;
  catConservacion: string;
  catFederacion: string;
  catSeguridad: string;
  catExploracion: string;
  byAuthor: string;

  // Events
  eventsTitle: string;
  eventsSub: string;
  eventProposalTitle: string;
  eventProposalDesc: string;
  eventProposalBtn: string;
  catLimpieza: string;
  catCurso: string;
  catCompeticion: string;
  catReunion: string;

  // Instructors
  instructorsTitle: string;
  instructorsSub: string;
  experienceYears: string;
  licenceCode: string;

  // Graduates
  graduatesTitle: string;
  graduatesSub: string;
  searchPlaceholder: string;
  filterLevel: string;
  allLevels: string;
  gradDate: string;
  instructorCertifier: string;
  notVerifiedTitle: string;
  notVerifiedDesc: string;

  // Admin Dashboard
  adminAccessTitle: string;
  adminAccessDesc: string;
  adminPasswordLabel: string;
  adminPasswordPlaceholder: string;
  adminWorkspaceTitle: string;
  adminWorkspaceDesc: string;
  adminDataModules: string;
  adminAddRecord: string;
  adminEditRecord: string;
  formTitle: string;
  formDesc: string;
  formUrl: string;
  formCategory: string;
  formDate: string;
  formAuthor: string;
  formContent: string;
  formLocation: string;
  formName: string;
  formBio: string;
  formLevel: string;
  formExperience: string;
  formCertCode: string;
  formCourseName: string;
  formInstructorName: string;
  formGradDate: string;
  
  // Tabs
  tabGallery: string;
  tabNews: string;
  tabEvents: string;
  tabInstructors: string;
  tabGraduates: string;
}

export const translations: Record<'es' | 'en', TranslationDict> = {
  es: {
    appName: "FCAS CUBA",
    appSub: "Federación Cubana de Actividades Subacuáticas",
    adminPanel: "Acceso Admin",
    logout: "Cerrar Sesión",
    login: "Iniciar Sesión",
    backToPublic: "Volver al Sitio Público",
    contactFcas: "Contactar con la FCAS",
    verified: "Verificado",
    all: "Todos",
    date: "Fecha",
    category: "Categoría",
    actions: "Acciones",
    cancel: "Cancelar",
    save: "Guardar Cambios",
    add: "Añadir Registro",
    edit: "Editar",
    delete: "Eliminar",
    loading: "Cargando...",

    navHome: "Inicio",
    navGallery: "Galería Submarina",
    navNews: "Noticias y Boletines",
    navEvents: "Eventos",
    navInstructors: "Instructores",
    navGraduates: "Directorio de Graduados",
    navAdminPanel: "Ir al Panel Admin",

    heroTitle: "Federación Cubana de Actividades Subacuáticas",
    heroSub: "Descubre, protege y explora los tesoros sumergidos del archipiélago cubano. Formando buceadores con estándares mundiales de excelencia y compromiso ecológico.",
    heroBtnGraduates: "Directorio de Graduados",
    heroBtnLearnMore: "Saber Más",

    missionTitle: "Nuestra Misión y Visión",
    missionDesc: "La Federación Cubana de Actividades Subacuáticas (FCAS) es la entidad rectora del buceo recreativo, deportivo y científico en todo el archipiélago cubano. Fundada con el compromiso de formar deportistas de alto nivel y salvaguardar los ecosistemas costeros, promovemos la instrucción calificada y el turismo submarino responsable.",
    ecoTitle: "Ecología Activa",
    ecoDesc: "Lideramos limpiezas de fondos marinos, campañas de recogida de redes fantasmas y proyectos de restauración de arrecifes de coral en áreas protegidas.",
    certTitle: "Certificación Oficial",
    certDesc: "Otorgamos licencias oficiales avaladas internacionalmente por la CMAS (Confederación Mundial de Actividades Subacuáticas) y reconocidas en todo el mundo.",

    destinationsTitle: "Destinos de Buceo Emblemáticos en Cuba",
    destinationsSub: "Conoce los santuarios de biodiversidad marina protegidos por nuestra federación.",
    mariaLaGordaTitle: "María la Gorda",
    mariaLaGordaDesc: "Ubicado en la Península de Guanahacabibes. Famoso por sus majestuosas colonias de coral negro, cuevas misteriosas y extensas paredes que caen a más de cien metros.",
    jardinesTitle: "Jardines de la Reina",
    jardinesDesc: "El santuario marino más virgen del Caribe. Hogar de una asombrosa abundancia de tiburones sedosos y de arrecife, gigantescos meros guasa y corales prístinos.",
    bahiaCochinosTitle: "Bahía de Cochinos",
    bahiaCochinosDesc: "Buceo de pared espectacular accesible directamente desde la costa, sin necesidad de barcos. Sus aguas tranquilas y cristalinas son ideales para todos los niveles.",

    galleryTitle: "Galería Submarina de Cuba",
    gallerySub: "Imágenes de nuestras expediciones científicas, entrenamientos nacionales y la asombrosa biodiversidad de los fondos marinos cubanos.",
    catFauna: "Fauna Marina",
    catFlora: "Flora / Arrecife",
    catNaufragios: "Naufragios",
    catEntrenamiento: "Entrenamiento",
    catPaisaje: "Paisajes",

    newsTitle: "Últimas Noticias y Boletines",
    newsSub: "Mantente informado sobre las expediciones científicas, regulaciones de buceo seguro, campeonatos nacionales y eventos ecológicos.",
    catConservacion: "Conservación",
    catFederacion: "Federación",
    catSeguridad: "Seguridad",
    catExploracion: "Exploración",
    byAuthor: "Por",

    eventsTitle: "Próximos Eventos y Cursos",
    eventsSub: "Participa en nuestras jornadas voluntarias de conservación, campeonatos nacionales de apnea y cursos de especialidad científica.",
    eventProposalTitle: "¿Quieres organizar un evento ecológico en tu provincia?",
    eventProposalDesc: "La FCAS apoya las iniciativas locales de limpiezas de costas o charlas educativas sobre conservación marina proporcionando tanques de aire, logística y avales oficiales.",
    eventProposalBtn: "Proponer un Evento",
    catLimpieza: "Limpieza Marina",
    catCurso: "Curso Oficial",
    catCompeticion: "Competición",
    catReunion: "Reunión",

    instructorsTitle: "Instructores Nacionales Certificados",
    instructorsSub: "Docentes altamente cualificados con acreditaciones internacionales vigentes y amplia trayectoria profesional formando buzos seguros y comprometidos.",
    experienceYears: "años de experiencia",
    licenceCode: "Licencia",

    graduatesTitle: "Directorio de Buceadores Graduados",
    graduatesSub: "Consulta pública para verificar la legitimidad y el estatus de las certificaciones emitidas bajo el reglamento oficial de la FCAS.",
    searchPlaceholder: "Buscar por nombre del graduado o número de licencia...",
    filterLevel: "Filtrar por nivel:",
    allLevels: "Todos los niveles",
    gradDate: "Fecha de Graduación",
    instructorCertifier: "Instructor Certificador",
    notVerifiedTitle: "Buzor no verificado",
    notVerifiedDesc: "Si tu licencia o curso reciente no aparece aún en este buscador oficial, ponte en contacto con la secretaría de la FCAS para actualizar tu expediente.",

    adminAccessTitle: "Acceso Administrativo",
    adminAccessDesc: "Inicie sesión con su clave autorizada para editar y actualizar el catálogo oficial de graduados, instructores, noticias, eventos y galería.",
    adminPasswordLabel: "Contraseña de Administrador",
    adminPasswordPlaceholder: "Introduzca la contraseña de seguridad...",
    adminWorkspaceTitle: "Administración de Contenido",
    adminWorkspaceDesc: "Centro de gestión para oficiales de la FCAS. Realice adiciones y modificaciones en tiempo real con almacenamiento local persistente.",
    adminDataModules: "Módulos de datos",
    adminAddRecord: "Añadir Nuevo Registro",
    adminEditRecord: "Editar Registro",
    formTitle: "Título",
    formDesc: "Descripción corta",
    formUrl: "URL de la Imagen",
    formCategory: "Categoría",
    formDate: "Fecha",
    formAuthor: "Autor",
    formContent: "Contenido del Boletín",
    formLocation: "Ubicación",
    formName: "Nombre Completo",
    formBio: "Biografía profesional",
    formLevel: "Nivel / Certificación",
    formExperience: "Años de experiencia",
    formCertCode: "Código de Licencia",
    formCourseName: "Nombre del Curso",
    formInstructorName: "Instructor Certificador",
    formGradDate: "Fecha de Graduación",
    
    tabGallery: "Galería de Fotos",
    tabNews: "Noticias y Boletines",
    tabEvents: "Eventos y Cursos",
    tabInstructors: "Instructores",
    tabGraduates: "Directorio de Graduados"
  },
  en: {
    appName: "FCAS CUBA",
    appSub: "Cuban Federation of Underwater Activities",
    adminPanel: "Admin Access",
    logout: "Log Out",
    login: "Log In",
    backToPublic: "Back to Public Site",
    contactFcas: "Contact FCAS",
    verified: "Verified",
    all: "All",
    date: "Date",
    category: "Category",
    actions: "Actions",
    cancel: "Cancel",
    save: "Save Changes",
    add: "Add Entry",
    edit: "Edit",
    delete: "Delete",
    loading: "Loading...",

    navHome: "Home",
    navGallery: "Underwater Gallery",
    navNews: "News & Bulletins",
    navEvents: "Events",
    navInstructors: "Instructors",
    navGraduates: "Graduates Directory",
    navAdminPanel: "Go to Admin Panel",

    heroTitle: "Cuban Federation of Underwater Activities",
    heroSub: "Discover, protect, and explore the sunken treasures of the Cuban archipelago. Training divers with world-class standards of excellence and ecological commitment.",
    heroBtnGraduates: "Graduates Directory",
    heroBtnLearnMore: "Learn More",

    missionTitle: "Our Mission & Vision",
    missionDesc: "The Cuban Federation of Underwater Activities (FCAS) is the governing body for recreational, sports, and scientific diving across the Cuban archipelago. Founded with the commitment to train high-level athletes and safeguard coastal ecosystems, we promote qualified instruction and responsible submarine tourism.",
    ecoTitle: "Active Ecology",
    ecoDesc: "We lead seabottom cleanups, ghost nets recovery campaigns, and coral reef restoration projects in marine protected areas.",
    certTitle: "Official Certification",
    certDesc: "We issue official diving licenses internationally accredited by CMAS (World Confederation of Underwater Activities) and recognized globally.",

    destinationsTitle: "Emblematic Diving Destinations in Cuba",
    destinationsSub: "Explore the marine biodiversity sanctuaries protected by our federation.",
    mariaLaGordaTitle: "María la Gorda",
    mariaLaGordaDesc: "Located on the Guanahacabibes Peninsula. Famous for its majestic black coral colonies, mysterious caves, and deep walls plunging over a hundred meters.",
    jardinesTitle: "Gardens of the Queen",
    jardinesDesc: "The most pristine marine sanctuary in the Caribbean. Home to an amazing abundance of silky and reef sharks, giant jewfish, and pristine corals.",
    bahiaCochinosTitle: "Bay of Pigs",
    bahiaCochinosDesc: "Spectacular wall diving accessible directly from the shore without boats. Its calm and crystal-clear waters are perfect for divers of all experience levels.",

    galleryTitle: "Cuba's Underwater Gallery",
    gallerySub: "Images from our scientific expeditions, national training sessions, and the amazing biodiversity of the Cuban marine seabeds.",
    catFauna: "Marine Fauna",
    catFlora: "Flora / Reef",
    catNaufragios: "Shipwrecks",
    catEntrenamiento: "Training",
    catPaisaje: "Landscapes",

    newsTitle: "Latest News & Bulletins",
    newsSub: "Stay informed about scientific expeditions, safe diving regulations, national championships, and ecological events.",
    catConservacion: "Conservation",
    catFederacion: "Federation",
    catSeguridad: "Safety",
    catExploracion: "Exploration",
    byAuthor: "By",

    eventsTitle: "Upcoming Events & Courses",
    eventsSub: "Participate in our voluntary conservation days, national freediving championships, and scientific specialty courses.",
    eventProposalTitle: "Do you want to organize an ecological event in your province?",
    eventProposalDesc: "FCAS supports local beach cleanup initiatives or educational talks on marine conservation by providing air tanks, logistics, and official backing.",
    eventProposalBtn: "Propose an Event",
    catLimpieza: "Marine Cleanup",
    catCurso: "Official Course",
    catCompeticion: "Competition",
    catReunion: "Meeting",

    instructorsTitle: "Certified National Instructors",
    instructorsSub: "Highly qualified educators with current international credentials and extensive professional experience training safe and committed divers.",
    experienceYears: "years of experience",
    licenceCode: "License",

    graduatesTitle: "Graduated Divers Directory",
    graduatesSub: "Public query system to verify the legitimacy and status of diving certifications issued under the official regulations of FCAS.",
    searchPlaceholder: "Search by graduate name or license number...",
    filterLevel: "Filter by level:",
    allLevels: "All levels",
    gradDate: "Graduation Date",
    instructorCertifier: "Certifying Instructor",
    notVerifiedTitle: "Diver not verified",
    notVerifiedDesc: "If your license or recent course does not appear yet in this official search, please contact the FCAS secretariat to update your file.",

    adminAccessTitle: "Administrative Access",
    adminAccessDesc: "Log in with your authorized credentials to edit and update the official directory of graduates, instructors, news, events, and gallery.",
    adminPasswordLabel: "Administrator Password",
    adminPasswordPlaceholder: "Enter security password...",
    adminWorkspaceTitle: "Content Management",
    adminWorkspaceDesc: "Management hub for FCAS officials. Perform additions and modifications in real time with persistent local storage.",
    adminDataModules: "Data Modules",
    adminAddRecord: "Add New Entry",
    adminEditRecord: "Edit Entry",
    formTitle: "Title",
    formDesc: "Short description",
    formUrl: "Image URL",
    formCategory: "Category",
    formDate: "Date",
    formAuthor: "Author",
    formContent: "Bulletin Content",
    formLocation: "Location",
    formName: "Full Name",
    formBio: "Professional biography",
    formLevel: "Level / Certification",
    formExperience: "Years of experience",
    formCertCode: "License Code",
    formCourseName: "Course Name",
    formInstructorName: "Certifying Instructor",
    formGradDate: "Graduation Date",
    
    tabGallery: "Photo Gallery",
    tabNews: "News & Bulletins",
    tabEvents: "Events & Courses",
    tabInstructors: "Instructors",
    tabGraduates: "Graduates Directory"
  }
};
