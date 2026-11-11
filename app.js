/* =====================================================================
   SKI ITALIE · 13 → 17 décembre 2026
   Coordination de groupe. Partage via Firebase Realtime Database,
   repli local sinon.
   ===================================================================== */

const CFG = {
  // URL Firebase Realtime Database pour le partage temps réel.
  // Vide = mode local.
  dbUrl: "",
  room: "ski-italie-dec2026",
  dep: "2026-12-13",
  ret: "2026-12-17",
  budget: 800,
  groupSize: 5
};

const S = {
  me: null, members: [], tasks: [], budget: [], depenses: [],
  vote: {}, chat: [], slots: [], filter: "all", online: false
};

const DEFAULT_GROUP = [
  {id:"p1", name:"", age:null, permit:"", role:"", emoji:"🦊"},
  {id:"p2", name:"", age:null, permit:"", role:"", emoji:"🐻"},
  {id:"p3", name:"", age:null, permit:"", role:"", emoji:"🦅"},
  {id:"p4", name:"", age:null, permit:"", role:"", emoji:"🐺"},
  {id:"p5", name:"", age:22, permit:"Français · 5 ans", role:"Conducteur principal", emoji:"🚗"}
];

const STATIONS = [
  {id:"livigno", nom:"Livigno", region:"Lombardie", best:true, score:8.9,
   km:115, pistes:74, remontees:32, altMin:1816, altMax:2900, dist:190,
   trajet:"3 h 30", ouverture:"28 nov. 2026",
   forfait4:163.5, forfait4Adulte:192, logement:110, neige:"Excellente",
   securite:"Damage nocturne intégral, balises numérotées sur chaque piste, pisteurs et motoneige de secours, 10 règles FIS",
   plus:"Le plus gros domaine de la sélection. Village le plus haut (1 816 m). Nos dates tombent en période promotionnelle sur le forfait.",
   moins:"3 h 30 de route depuis Malpensa. Le tunnel de la Forcola et le Passo Foscagno peuvent fermer en cas de forte neige.",
   ouvertureNote:"Ouverture confirmée au 28 nov. Beaucoup de remontées hautes ne tournent pas avant Noël."},
  {id:"tonale", nom:"Pontedilegno-Tonale", region:"Lombardie / Trentin", best:false, score:8.5,
   km:100, pistes:46, remontees:29, altMin:1121, altMax:3016, dist:170,
   trajet:"3 h 00", ouverture:"28 nov. 2026",
   forfait4:191, forfait4Adulte:191, logement:105, neige:"Très bonne",
   securite:"Assurance obligatoire rappelée sur le site officiel, casque obligatoire, page dédiée à l'assurance, secours sur piste",
   plus:"Le glacier Presena (3 000 m) garantit de la neige même en décembre pauvre. Smart Skipass en ligne jusqu'à -25 %.",
   moins:"Liaisons Ponte di Legno vers Passo Tonale par bus selon l'enneigement en début de saison. Le glacier ferme par grand vent.",
   ouvertureNote:"Ouverture confirmée au 28 nov. avec deux nouvelles remontées."},
  {id:"bormio", nom:"Bormio", region:"Lombardie", best:false, score:8.3,
   km:110, pistes:30, remontees:30, altMin:1222, altMax:3012, dist:175,
   trajet:"3 h 15", ouverture:"4 déc. 2026",
   forfait4:172, forfait4Adulte:202, logement:115, neige:"Très bonne",
   securite:"90 % des pistes équipées de canons à neige, station des JO d'hiver Milano-Cortina 2026",
   plus:"Le forfait Alta Valtellina couvre Bormio, Santa Caterina, Cima Piazzi et Livigno, avec ski-bus gratuit.",
   moins:"Prix dynamiques : plus tu achètes tard, plus c'est cher. Cima Piazzi n'ouvre que le 19 déc.",
   ouvertureNote:"Bormio ouvre le 4 déc. Cima Piazzi-San Colombano seulement le 19 déc."},
  {id:"aprica", nom:"Aprica", region:"Lombardie", best:false, score:7.6,
   km:50, pistes:17, remontees:16, altMin:1181, altMax:2300, dist:130,
   trajet:"2 h 20", ouverture:"28 nov. 2026",
   forfait4:177, forfait4Adulte:177, logement:100, neige:"Correcte",
   securite:"Station familiale, damage régulier, assurance et casque obligatoires comme partout en Italie",
   plus:"Le moins cher et le plus proche. Nos dates tombent en basse saison. Promo Free Skipass si 3 nuits minimum chez un partenaire.",
   moins:"50 km et 16 remontées seulement : le tour est fait en une journée.",
   ouvertureNote:"Ouverture au 28 nov. Petit domaine exploitable à 100 % rapidement."},
  {id:"madesimo", nom:"Madesimo", region:"Lombardie", best:false, score:7.2,
   km:37, pistes:39, remontees:11, altMin:1550, altMax:2250, dist:125,
   trajet:"2 h 15", ouverture:"27 nov. 2026",
   forfait4:null, forfait4Adulte:null, logement:95, neige:"Très bonne",
   securite:"Damage soigné, assurance et casque obligatoires",
   plus:"Le trajet le plus court et la meilleure moyenne de chutes de neige (314 cm/an).",
   moins:"37 km et 11 remontées : le plus petit domaine. Altitude max 2 250 m, sensible au redoux.",
   ouvertureNote:"Ouverture dès le 27 nov. Grille tarifaire à confirmer sur skiareavalchiavenna.it"},
  {id:"cervinia", nom:"Cervinia", region:"Vallée d'Aoste", best:false, score:7.0,
   km:null, pistes:null, remontees:null, altMin:2050, altMax:3883, dist:150,
   trajet:"2 h 45", ouverture:"24 oct. 2026",
   forfait4:null, forfait4Adulte:null, logement:190, neige:"Excellente",
   securite:"Très bon niveau, domaine d'altitude, ski toute l'année sur le glacier",
   plus:"Neige garantie dès octobre, domaine immense, liaison Zermatt.",
   moins:"Forfait international à 64,50 € par jour et logements à 190 € la nuit : incompatible avec 800 € par personne.",
   ouvertureNote:"Ouvert depuis le 24 oct. Aucun problème de neige, problème de budget."},
  {id:"madonna", nom:"Madonna di Campiglio", region:"Trentin", best:false, score:6.9,
   km:150, pistes:null, remontees:null, altMin:1550, altMax:2580, dist:185,
   trajet:"3 h 15", ouverture:"21 nov. 2026",
   forfait4:null, forfait4Adulte:280, logement:240, neige:"Très bonne",
   securite:"Très bon niveau, damage soigné, station haut de gamme",
   plus:"Beau domaine de 150 km, très bien damé.",
   moins:"Une des stations les plus chères d'Italie. Logements à 240 € la nuit.",
   ouvertureNote:"Ouverte depuis le 21 nov. Aucun problème de neige, problème de budget."}
];

const TASK_SEED = [
  {t:"Réserver les 5 vols A/R directs TLV vers MXP", cat:"Vols", who:"p5", prio:"haute", d:14,
   det:"Wizz Air Malta (wizzair.com), El Al (elal.com), Israir, Arkia, Bluebird. Vérifier que c'est bien MXP et pas BGY. Ajouter la valise soute au moment de l'achat."},
  {t:"Confirmer le nombre de pistes réellement ouvertes sur nos dates", cat:"Station", who:"p1", prio:"haute", d:5,
   det:"Appeler la station 3 à 5 jours avant le départ. Pontedilegno-Tonale : +39 0364 92097. À la mi-décembre, un domaine de 115 km peut n'en avoir que 45 d'ouverts."},
  {t:"Réserver l'Airbnb 5 personnes, 4 nuits, proche des pistes", cat:"Logement", who:"p2", prio:"haute", d:20,
   det:"13 au 17 décembre 2026. Vérifier les frais de ménage, la taxe de séjour, la distance réelle aux pistes, le parking inclus et la possibilité d'un check-in tardif."},
  {t:"Réserver la voiture à Malpensa, conducteur Membre 5", cat:"Voiture", who:"p5", prio:"haute", d:21,
   det:"Avec un conducteur de 22 ans, tous les loueurs sont accessibles. Supplément jeune conducteur 22-24 ans : 11 € par jour chez Enterprise, National et Alamo, 36,60 € par jour chez Hertz, environ 25,66 € chez Avis. Il se paie par jour et par conducteur."},
  {t:"Acheter les forfaits de ski en ligne", cat:"Forfaits", who:"p3", prio:"haute", d:14,
   det:"Livigno : shop.skipasslivigno.com, période promotionnelle jusqu'au 18 décembre, 4 jours Youth à 163,50 €. Achat en ligne jusqu'à -25 %."},
  {t:"Réserver la location de matériel de ski pour 5 personnes, 4 jours", cat:"Matériel", who:"p4", prio:"moyenne", d:18,
   det:"David's Rental Livigno (+39 0342 99 66 85), Scuola Sci Livigno (+39 0342 996767). Pack standard 4 jours environ 60 €. Le casque est obligatoire, à inclure."},
  {t:"Demander l'attestation d'assurance responsabilité civile en anglais", cat:"Administratif", who:"p1", prio:"haute", d:25,
   det:"Obligatoire sur les pistes italiennes depuis 2022. Sans attestation : 3 € par jour et par personne sur place, et 150 € d'amende par personne si on ne peut pas prouver."},
  {t:"Vérifier que la voiture louée a pneus neige ou chaînes", cat:"Voiture", who:"p5", prio:"haute", d:21,
   det:"Obligatoire du 15 novembre au 15 avril sur les routes de montagne italiennes. Demander une confirmation écrite au loueur avant de partir."},
  {t:"Vérifier la validité des passeports", cat:"Administratif", who:"all", prio:"haute", d:30,
   det:"Chacun vérifie le sien : validité de 6 mois après le retour. Permis de conduire en original et permis international selon le permis utilisé."},
  {t:"Prendre une assurance voyage et rapatriement", cat:"Administratif", who:"p2", prio:"moyenne", d:25,
   det:"Le secours sur piste n'est pas couvert par l'assurance responsabilité civile obligatoire. À Santa Caterina, le sauvetage est payant."},
  {t:"Planifier le trajet MXP vers la station", cat:"Voiture", who:"p5", prio:"moyenne", d:10,
   det:"Vers Livigno : tunnel de la Forcola et Passo Foscagno. Regarder l'état des routes la veille. Faire le plein à Livigno, l'essence y est détaxée."},
  {t:"Organiser les courses et les repas", cat:"Divers", who:"p4", prio:"basse", d:7,
   det:"Compter 25 à 40 € par jour et par personne. Supermarché plutôt que restaurant à midi. Le budget de 800 € par personne ne couvre pas la nourriture."},
  {t:"Prévoir le retour, le vol Wizz Air MXP vers TLV part à 05 h 00", cat:"Vols", who:"p1", prio:"haute", d:20,
   det:"Cela veut dire être à l'aéroport à 2 h 30. Rendre la voiture la veille au soir, ou payer une nuit d'hôtel près de Malpensa."},
  {t:"Préparer sa valise avec la check-list", cat:"Divers", who:"all", prio:"basse", d:5,
   det:"Voir l'onglet Check-list. Chacun coche de son côté."}
];

const CHECKLIST = [
  {g:"Papiers", items:[
    "Passeport valide 6 mois après le retour",
    "Permis de conduire en original",
    "Permis de conduire international si permis israélien",
    "Carte d'identité",
    "Attestation d'assurance RC en anglais",
    "Attestation d'assurance voyage et rapatriement",
    "Billet d'avion",
    "Confirmation de réservation Airbnb",
    "Confirmation de location de voiture",
    "Confirmation forfaits et matériel"
  ]},
  {g:"Ski", items:[
    "Casque — obligatoire pour tous en Italie depuis août 2025",
    "Masque de ski et lunettes catégorie 3 ou 4",
    "Gants et sous-gants",
    "Chaussettes de ski, 2 à 3 paires",
    "Sous-couches thermiques, haut et bas",
    "Pantalon et veste de ski",
    "Crème solaire SPF50 et stick à lèvres",
    "Protection dorsale, recommandée",
    "Après-ski ou chaussures imperméables"
  ]},
  {g:"Voiture", items:[
    "Carte de crédit au nom du conducteur, plafond au moins 800 €",
    "Vérifier pneus neige ou chaînes, obligatoire du 15/11 au 15/04",
    "Confirmer le conducteur additionnel sur le contrat",
    "Prendre des photos horodatées de la voiture au retrait",
    "Adaptateur et câble de recharge téléphone",
    "Support téléphone pour la voiture"
  ]},
  {g:"Commun", items:[
    "Euros en liquide, petites coupures",
    "Chargeur et batterie externe",
    "Trousse de premiers secours",
    "Médicaments personnels",
    "Numéros d'urgence enregistrés dans le téléphone",
    "Serviette microfibre",
    "Bouchons d'oreilles et masque de sommeil"
  ]}
];

const CONTACTS = [
  {n:"Urgences Europe", p:"112", d:"Numéro unique depuis n'importe quel téléphone, y compris étranger"},
  {n:"Pontedilegno-Tonale", p:"+39 0364 92097", d:"Consorzio Adamello Ski, info@pontedilegnotonale.com"},
  {n:"Pontedilegno-Tonale (2)", p:"+39 0364 92639", d:"Second numéro du consorzio"},
  {n:"Madesimo Infopoint", p:"+39 0343 53015", d:"info@madesimo.eu"},
  {n:"Aprica Pro Loco", p:"+39 0342 746113", d:"Également joignable sur WhatsApp"},
  {n:"Enterprise / National / Alamo MXP T1", p:"+39 02 5858 0333", d:"Loueur dans l'aéroport, niveau arrivées"},
  {n:"Enterprise / National / Alamo MXP T2", p:"+39 02 5858 3832", d:"Terminal 2"},
  {n:"Avis Malpensa T2", p:"+39 02 5858 3803", d:"Également +39 02 5858 3812"},
  {n:"Keddy by Europcar MXP T1", p:"+39 02 3056 8786", d:"Caution d'environ 800 €, remboursée en 15 à 30 jours"},
  {n:"David's Rental Ski Livigno", p:"+39 0342 99 66 85", d:"À 100 m de la télécabine Mottolino"},
  {n:"Scuola Sci Livigno", p:"+39 0342 996767", d:"Via Fontana 206/A, aussi +39 379 291 9870"},
  {n:"SNOWELL International", p:"+423 239 61 81", d:"info@snowell.com, Rent and Go Amerikan Livigno"}
];

const PRESTATIONS = [
  {k:"vol", label:"Vols Tel Aviv vers Milan (MXP)", count:8,
   note:"Directs uniquement. Vérifier que l'aéroport est bien MXP (Malpensa) et pas BGY (Bergame), Wizz Air dessert les deux.",
   liens:[
     {n:"Wizz Air Malta", u:"https://wizzair.com", d:"1 à 2 vols par jour, valise soute à ajouter à l'achat"},
     {n:"El Al", u:"https://www.elal.com", d:"2 à 3 vols par jour, +972 3 977 1111"},
     {n:"Israir", u:"https://www.israir.co.il", d:"+972 3 510 5555"},
     {n:"Arkia", u:"https://www.arkia.co.il", d:"Vols TLV-MXP dès le 2 décembre 2026"},
     {n:"Bluebird Airways", u:"https://www.bluebirdair.com", d:"Compagnie israélienne"},
     {n:"Google Flights", u:"https://www.google.com/travel/flights", d:"Comparateur"},
     {n:"Skyscanner", u:"https://www.skyscanner.fr", d:"Comparateur"},
     {n:"Kiwi.com", u:"https://www.kiwi.com", d:"Comparateur"}
   ]},
  {k:"logement", label:"Logement, Airbnb et appartements", count:6,
   note:"5 personnes, 4 nuits, proche des pistes. Vérifier frais de ménage, taxe de séjour et distance réelle aux pistes.",
   liens:[
     {n:"Airbnb Livigno, au pied des pistes", u:"https://www.airbnb.fr/livigno-italy/stays/ski-in-ski-out", d:"Ski-in et ski-out"},
     {n:"Airbnb Livigno, appartements", u:"https://www.airbnb.fr/livignoitaly-livigno-italy/stays/condos", d:"Appartements en résidence"},
     {n:"Airbnb Pontedilegno-Tonale", u:"https://www.airbnb.it/ponte-di-legno-italy/stays", d:"140 logements, dès 27 € la nuit"},
     {n:"Airbnb Aprica", u:"https://www.airbnb.it/aprica-italy/stays", d:"Moyenne de 98 à 116 € la nuit"},
     {n:"Booking.com Livigno", u:"https://www.booking.com/searchresults.fr.html?ss=Livigno", d:"Alternative à Airbnb"},
     {n:"Casamundo Livigno", u:"https://www.casamundo.fr/vacances/vacances-au-ski/livigno", d:"Comparateur multi-sites"}
   ]},
  {k:"voiture", label:"Location de voiture à Malpensa", count:9,
   note:"Conducteur : Membre 5, 22 ans, permis français depuis 5 ans. Tous les loueurs sont accessibles.",
   liens:[
     {n:"Enterprise MXP Terminal 1", u:"https://www.enterpriserentacar.it/en/car-hire-locations/it/milan-malpensa-airport-terminal-1-lla2.html", d:"22-24 ans : 11 € par jour HT, caution 500 €"},
     {n:"Enterprise MXP Terminal 2", u:"https://www.enterprise.com/en/car-rental-locations/it/milan-malpensa-airport-terminal-2-lldg.html", d:"Conducteur additionnel 5 € par jour"},
     {n:"National MXP T1", u:"https://www.nationalcar.com/en/car-rental-locations/it/milan-malpensa-airport-terminal-1-llnb.html", d:"Caution 500 €"},
     {n:"Avis Malpensa T2", u:"https://www.avis.com", d:"22-24 ans : environ 25,66 € par jour"},
     {n:"Hertz Italie", u:"https://www.hertz.com", d:"22-24 ans : 36,60 € par jour TTC, plafonné"},
     {n:"SIXT Malpensa", u:"https://www.sixt.com/car-rental/italy/milan/milan-ap-malpensa-t1", d:"Pré-autorisation selon catégorie"},
     {n:"Keddy by Europcar MXP T1", u:"https://www.qeeq.com", d:"Caution d'environ 800 €, crédit ou débit"},
     {n:"Rentalcars.com", u:"https://www.rentalcars.com", d:"Comparateur de loueurs"},
     {n:"Discover Cars", u:"https://www.discovercars.com", d:"Comparateur spécialisé Italie"}
   ]},
  {k:"forfait", label:"Forfaits de remontées mécaniques", count:10,
   note:"Achat en ligne systématiquement moins cher, jusqu'à -25 %. Nos dates tombent en période promotionnelle à Livigno et en basse saison à Aprica.",
   liens:[
     {n:"Skipass Livigno, boutique", u:"https://shop.skipasslivigno.com", d:"4 jours Youth à 163,50 € en promotion"},
     {n:"Livigno, grille tarifaire", u:"https://www.livigno.eu/en/skipass-online", d:"Grille officielle 2026/27"},
     {n:"Pontedilegno-Tonale, boutique", u:"https://shop.pontedilegnotonale.com", d:"Smart Skipass jusqu'à -25 %"},
     {n:"Pontedilegno-Tonale, tarifs", u:"https://www.pontedilegnotonale.com/en/skipass/skipass-prices/", d:"Grille et calculateur"},
     {n:"Bormio, boutique", u:"https://shop.bormioski.eu", d:"Prix dynamiques"},
     {n:"Bormio, tarifs", u:"https://www.bormioski.eu/en/bormio-skipass", d:"Alta Valtellina 4 jours : 202 € ou 172 €"},
     {n:"Aprica, boutique", u:"https://shop.apricaonline.com", d:"4 jours adulte à 177 € en basse saison"},
     {n:"Aprica, tarifs", u:"https://www.apricaonline.com/it/vivere-la-montagna/vivere-la-montagna-inverno/impianti", d:"Grille détaillée"},
     {n:"Madesimo, boutique", u:"https://www.skiareavalchiavenna.it/en/buy-online/", d:"Madesimo et Campodolcino"},
     {n:"Comparateur forfaits Italie", u:"https://funivie.it/fr/forfaits", d:"27 stations comparées"}
   ]},
  {k:"materiel", label:"Location de matériel de ski", count:7,
   note:"5 personnes, 4 jours. Réserver en ligne jusqu'à -50 % et retrait possible la veille au soir.",
   liens:[
     {n:"David's Rental Livigno", u:"https://www.davidsrentalskibike.com/en/ski-rent-price-list", d:"Standard 4 jours : 60 €, à 100 m de Mottolino"},
     {n:"Scuola Sci Livigno", u:"https://scuolascilivigno.info/en/rental", d:"Pack complet et casque"},
     {n:"Caravan Sports Livigno", u:"https://www.caranvasports.com/products/ski-rental-livigno", d:"Dès 24,50 € par jour, annulation gratuite"},
     {n:"Rent and Go Amerikan Livigno", u:"https://en.snowell.com/ski-hire/italy/lombardy-lombardia/sondrio/livigno", d:"À 100 m des pistes, retrait la veille"},
     {n:"Noleggio Living N.1 Livigno", u:"https://www.alpy.com/en/ski-rental/italy/lombardei/livigno/noleggio-living-n-1", d:"Protection dommage et vol"},
     {n:"Livigno BookYourRent", u:"https://livigno.bookyourrent.com/en/ski/rental-pricelist.html", d:"Grille par durée"},
     {n:"Skiarea Valchiavenna", u:"https://www.skiareavalchiavenna.it/en/", d:"Pour Madesimo"}
   ]},
  {k:"activites", label:"Activités et détente", count:5,
   note:"Le ski n'est pas la seule option : Bormio a des thermes, Livigno un Duty Free et un après-ski réputé.",
   liens:[
     {n:"Bormio Terme", u:"https://www.bormioterme.it", d:"Thermes et spa"},
     {n:"QC Terme Bormio", u:"https://www.qcterme.com/bormio", d:"Espace thermal haut de gamme"},
     {n:"Livigno, expériences", u:"https://www.livigno.eu/en/experiences-summer", d:"Snowpark, luge, Duty Free"},
     {n:"Pontedilegno-Tonale", u:"https://www.pontedilegnotonale.com/en/", d:"Programme de la saison"},
     {n:"Snow-forecast Italie", u:"https://www.snow-forecast.com/countries/Italy/resorts", d:"Prévisions de neige"}
   ]}
];

const $  = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s === null || s === undefined ? "" : s).replace(/[&<>"']/g, c =>
  ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const uid = () => Math.random().toString(36).slice(2, 9);
const eur = n => (Number(n) || 0).toFixed(2).replace(".", ",") + " €";

function toast(msg, kind){
  let t = $("#toast");
  if(!t){ t = document.createElement("div"); t.id = "toast"; document.body.appendChild(t); }
  t.className = "toast show" + (kind ? " " + kind : "");
  t.textContent = msg;
  clearTimeout(t._h);
  t._h = setTimeout(() => t.className = "toast", 2600);
}

function mem(id){ return S.members.find(m => m.id === id) || null; }
function isNamed(m){ return !!(m && m.name && m.name.trim()); }
function memName(id){
  if(id === "all") return "Tout le monde";
  const m = mem(id);
  if(!m) return "—";
  return m.name || "Membre " + m.id.replace("p", "");
}
function memEmoji(id){ const m = mem(id); return m ? m.emoji : "👤"; }

const LSKEY = "ski25_" + CFG.room;
const CHECKKEY = "ski25_check_" + CFG.room;
let storeOk = true;
try { localStorage.setItem("__t", "1"); localStorage.removeItem("__t"); }
catch(e){ storeOk = false; }

function readLocal(){
  if(!storeOk) return {};
  try { return JSON.parse(localStorage[LSKEY] || "{}"); } catch(e){ return {}; }
}
function saveLocal(){
  if(!storeOk) return;
  try {
    localStorage[LSKEY] = JSON.stringify({
      members:S.members, tasks:S.tasks, budget:S.budget, depenses:S.depenses,
      vote:S.vote, chat:S.chat, slots:S.slots, me:S.me
    });
  } catch(e){}
}

let dbMod = null, dbRef = null;

async function boot(){
  const loc = readLocal();
  S.members  = (loc.members && loc.members.length === DEFAULT_GROUP.length)
               ? loc.members : DEFAULT_GROUP.map(g => ({...g}));
  S.tasks    = loc.tasks    || TASK_SEED.map(t => ({id:uid(), done:false, ...t}));
  S.budget   = loc.budget   || [];
  S.depenses = loc.depenses || [];
  S.vote     = loc.vote     || {};
  S.chat     = loc.chat     || [];
  S.slots    = loc.slots    || [];
  S.me       = loc.me       || null;

  if(!CFG.dbUrl){ S.online = false; return; }

  try {
    const mods = await Promise.all([
      import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js")
    ]);
    dbMod = mods[1];
    const app = mods[0].initializeApp({databaseURL: CFG.dbUrl});
    dbRef = dbMod.ref(dbMod.getDatabase(app), "rooms/" + CFG.room);
    S.online = true;

    let first = true;
    dbMod.onValue(dbRef, snap => {
      const v = snap.val();
      if(v){
        if(v.members && v.members.length === DEFAULT_GROUP.length) S.members = v.members;
        if(v.tasks)    S.tasks    = v.tasks;
        if(v.budget)   S.budget   = v.budget;
        if(v.depenses) S.depenses = v.depenses;
        if(v.vote)     S.vote     = v.vote;
        if(v.chat)     S.chat     = v.chat;
        if(v.slots)    S.slots    = v.slots;
      } else if(first){
        push();
      }
      first = false;
      saveLocal();
      refreshAll();
    }, () => { S.online = false; refreshAll(); });
  } catch(e){
    S.online = false;
    console.warn("Firebase indisponible :", e);
  }
}

let pushTimer = null;
function push(){
  saveLocal();
  if(!S.online || !dbRef || !dbMod) return;
  clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    dbMod.set(dbRef, {
      members:S.members, tasks:S.tasks, budget:S.budget, depenses:S.depenses,
      vote:S.vote, chat:S.chat, slots:S.slots, updated:Date.now()
    }).catch(() => { S.online = false; refreshAll(); toast("Connexion perdue, sauvegarde locale", "warn"); });
  }, 250);
}

function icons(){ if(window.lucide){ try { lucide.createIcons(); } catch(e){} } }

function refreshAll(){
  renderTop(); renderKpis(); renderMembers(); renderTasks(); renderBudget();
  renderStations(); renderPrestations(); renderVote(); renderDepenses();
  renderSlots(); renderChat(); renderChecklist(); renderContacts();
  renderMemo(); fillSelects();
  icons();
}

function renderTop(){
  const badge = $("#syncBadge");
  if(badge){
    badge.className = "chip " + (S.online ? "chip-ok" : "chip-mute");
    badge.innerHTML = S.online
      ? '<i data-lucide="cloud"></i> Partagé entre les 5'
      : '<i data-lucide="hard-drive"></i> Local, cet appareil';
  }
  const days = Math.max(0, Math.ceil((new Date(CFG.dep + "T00:00:00") - new Date()) / 864e5));
  const cd = $("#countdown");
  if(cd) cd.textContent = days > 0 ? "J-" + days : "C'est parti";

  const mb = $("#meBadge");
  if(mb){
    if(S.me && isNamed(mem(S.me.id))){
      mb.innerHTML =
        '<span class="me-line"><span class="me-ava">' + esc(memEmoji(S.me.id)) + '</span>' +
        '<span>Connecté en tant que <b>' + esc(memName(S.me.id)) + '</b></span></span>' +
        '<button class="btn ghost sm" data-act="identify"><i data-lucide="repeat"></i> Changer</button>';
    } else {
      mb.innerHTML =
        '<span class="me-line"><i data-lucide="user-plus"></i> <b>Qui es-tu ?</b> ' +
        'Choisis ton prénom pour que le groupe sache qui fait quoi.</span>' +
        '<button class="btn sm" data-act="identify"><i data-lucide="mouse-pointer-click"></i> Choisir mon prénom</button>';
    }
  }

  const mine = $("#myTasks");
  if(mine){
    if(!(S.me && isNamed(mem(S.me.id)))){
      mine.innerHTML = '<p class="empty">Choisis ton prénom pour voir tes tâches.</p>';
    } else {
      const list = S.tasks.filter(t => t.who === S.me.id || t.who === "all");
      const left = list.filter(t => !t.done);
      const rows = left.slice(0, 5).map(t =>
        '<label class="tick"><input type="checkbox" data-act="toggle-task" data-id="' + t.id + '">' +
        '<span>' + esc(t.t) + '</span></label>').join("");
      mine.innerHTML = list.length
        ? '<div class="mini-stat"><b>' + left.length + '</b><span>tâche' + (left.length > 1 ? "s" : "") + ' à faire</span></div>' +
          (rows || '<p class="empty">Tout est fait. Bravo.</p>')
        : '<p class="empty">Aucune tâche attribuée pour l\'instant.</p>';
    }
  }
}

function pct(v){ return Math.round(v / CFG.budget * 100); }

function renderKpis(){
  const el = $("#kpis"); if(!el) return;
  const done = S.tasks.filter(t => t.done).length;
  const tot = S.tasks.length || 1;
  const prog = Math.round(done / tot * 100);
  const days = Math.max(0, Math.ceil((new Date(CFG.dep + "T00:00:00") - new Date()) / 864e5));
  const committed = S.budget.reduce((a, b) => a + (+b.m || 0), 0);
  const perHead = committed / CFG.groupSize;
  const named = S.members.filter(isNamed).length;

  el.innerHTML =
    '<div class="kpi"><div class="kpi-ic"><i data-lucide="calendar-days"></i></div>' +
      '<b>' + days + '</b><span>jours avant le départ</span></div>' +
    '<div class="kpi"><div class="kpi-ic"><i data-lucide="list-checks"></i></div>' +
      '<b>' + done + '<em>/' + tot + '</em></b><span>tâches terminées</span>' +
      '<div class="bar"><i style="width:' + prog + '%"></i></div></div>' +
    '<div class="kpi"><div class="kpi-ic"><i data-lucide="wallet"></i></div>' +
      '<b>' + eur(perHead) + '</b><span>engagé par personne</span>' +
      '<div class="bar ' + (perHead > CFG.budget ? "over" : "") + '">' +
      '<i style="width:' + Math.min(100, pct(perHead)) + '%"></i></div></div>' +
    '<div class="kpi"><div class="kpi-ic"><i data-lucide="users"></i></div>' +
      '<b>' + named + '<em>/5</em></b><span>membres identifiés</span>' +
      '<div class="bar"><i style="width:' + (named / 5 * 100) + '%"></i></div></div>';
}

function renderMembers(){
  const el = $("#memberGrid"); if(!el) return;
  el.innerHTML = S.members.map(m => {
    const mine = S.me && S.me.id === m.id;
    const named = isNamed(m);
    const tasks = S.tasks.filter(t => t.who === m.id);
    const done = tasks.filter(t => t.done).length;
    return '<article class="member ' + (mine ? "mine " : "") + (named ? "" : "blank") + '">' +
      '<header><span class="ava">' + esc(m.emoji) + '</span>' +
      '<div class="who"><h4>' + (named ? esc(m.name) : "Membre " + m.id.replace("p","")) + '</h4>' +
      '<p>' + (m.age ? m.age + " ans" : "âge à préciser") + (m.permit ? " · permis " + esc(m.permit) : "") + '</p></div>' +
      (mine ? '<span class="chip chip-acc">toi</span>' : "") + '</header>' +
      (m.role ? '<p class="role"><i data-lucide="badge-check"></i> ' + esc(m.role) + '</p>' : "") +
      '<div class="member-foot"><span class="tiny">' +
      (tasks.length ? done + "/" + tasks.length + " tâches" : "aucune tâche") + '</span>' +
      '<button class="btn ghost sm" data-act="edit-member" data-id="' + m.id + '">' +
      '<i data-lucide="pencil"></i> Modifier</button></div></article>';
  }).join("");
}

function renderTasks(){
  const el = $("#taskList"); if(!el) return;
  const list = S.tasks.filter(t =>
    S.filter === "all" ? true :
    S.filter === "done" ? t.done :
    S.filter === "todo" ? !t.done :
    t.who === S.filter);

  el.innerHTML = list.length ? list.map(t =>
    '<article class="task ' + (t.done ? "done" : "") + '">' +
      '<label class="tick"><input type="checkbox" ' + (t.done ? "checked" : "") +
      ' data-act="toggle-task" data-id="' + t.id + '"><span>' + esc(t.t) + '</span></label>' +
      (t.det ? '<p class="task-det">' + esc(t.det) + '</p>' : "") +
      '<div class="task-meta">' +
        '<span class="chip chip-acc">' + esc(t.cat) + '</span>' +
        '<span class="chip ' + (t.prio === "haute" ? "chip-hot" : t.prio === "moyenne" ? "chip-mid" : "chip-mute") + '">' + esc(t.prio) + '</span>' +
        '<span class="chip"><i data-lucide="clock"></i> ' + t.d + ' j</span>' +
        '<span class="chip"><span class="ava-xs">' + esc(memEmoji(t.who)) + '</span> ' + esc(memName(t.who)) + '</span>' +
        (t.done && t.by ? '<span class="chip chip-ok"><i data-lucide="check"></i> ' + esc(t.by) + '</span>' : "") +
      '</div></article>').join("")
    : '<p class="empty">Aucune tâche dans ce filtre.</p>';
}

function renderBudget(){
  const el = $("#budgetList"); if(!el) return;
  el.innerHTML = S.budget.length ? S.budget.map((b, i) =>
    '<tr><td><span class="chip chip-acc">' + esc(b.p) + '</span></td>' +
    '<td>' + esc(b.q) + '</td>' +
    '<td class="num">' + eur(b.m) + '</td>' +
    '<td>' + esc(memName(b.who)) + '</td>' +
    '<td><span class="chip ' + (b.s === "paye" ? "chip-ok" : b.s === "reserve" ? "chip-mid" : "chip-mute") + '">' + esc(b.s) + '</span></td>' +
    '<td class="num"><button class="btn ghost xs" data-act="del-budget" data-i="' + i + '"><i data-lucide="trash-2"></i></button></td></tr>').join("")
    : '<tr><td colspan="6" class="empty">Aucune dépense enregistrée.</td></tr>';

  const tot = S.budget.reduce((a, b) => a + (+b.m || 0), 0);
  const pp = tot / CFG.groupSize;
  const left = CFG.budget - pp;
  const t = $("#budgetTotal");
  if(t) t.innerHTML =
    '<div class="tot-row"><span>Engagé au total</span><b>' + eur(tot) + '</b></div>' +
    '<div class="tot-row"><span>Par personne, divisé par 5</span><b>' + eur(pp) + '</b></div>' +
    '<div class="tot-row ' + (left < 0 ? "neg" : "pos") + '"><span>' +
      (left < 0 ? "Dépassement" : "Marge restante") + '</span><b>' + eur(Math.abs(left)) + '</b></div>' +
    '<div class="bar ' + (pp > CFG.budget ? "over" : "") + '" style="margin-top:12px"><i style="width:' +
      Math.min(100, pct(pp)) + '%"></i></div>' +
    '<p class="tiny" style="margin-top:10px">Objectif : <b>' + CFG.budget + ' € par personne</b> hors nourriture, soit ' +
      eur(CFG.budget * CFG.groupSize) + ' pour le groupe.</p>';
}

function renderStations(){
  const dt = $("#distTable");
  if(dt){
    dt.innerHTML = STATIONS.map(s => {
      const t = s.trajet.replace(/\s/g, "");
      const m = t.match(/^(\d+)h(\d+)$/);
      const min = m ? (+m[1] * 60 + +m[2]) : (+t.match(/^(\d+)h$/)[1] * 60);
      return '<tr><td><b>' + esc(s.nom) + '</b>' + (s.best ? ' <span class="chip chip-ok">conseillé</span>' : "") + '</td>' +
        '<td>' + esc(s.trajet) + '</td>' +
        '<td class="num">' + s.dist + ' km</td>' +
        '<td class="num">' + Math.round(min / (s.dist / 100)) + ' min</td>' +
        '<td class="num">' + (s.altMax - s.altMin) + ' m</td></tr>';
    }).join("");
  }

  const el = $("#stationGrid"); if(!el) return;
  el.innerHTML = [...STATIONS].sort((a, b) => b.score - a.score).map(s =>
    '<article class="station ' + (s.best ? "best" : "") + '">' +
      '<header><span class="score">' + s.score.toFixed(1) + '</span>' +
      '<div><h4>' + esc(s.nom) + '</h4>' +
      '<p class="tiny">' + esc(s.region) + ' · ouverture ' + esc(s.ouverture) + '</p></div></header>' +
      '<div class="specs">' +
        '<div><span>Pistes</span><b>' + (s.pistes || "—") + '</b></div>' +
        '<div><span>Kilomètres</span><b>' + (s.km || "—") + '</b></div>' +
        '<div><span>Remontées</span><b>' + (s.remontees || "—") + '</b></div>' +
        '<div><span>Altitude</span><b>' + s.altMin + ' à ' + s.altMax + ' m</b></div>' +
        '<div><span>Depuis MXP</span><b>' + esc(s.trajet) + '</b></div>' +
        '<div><span>Forfait 4 jours</span><b>' + (s.forfait4 ? eur(s.forfait4) : "à confirmer") + '</b></div>' +
        '<div><span>Neige</span><b>' + esc(s.neige) + '</b></div>' +
        '<div><span>Logement par nuit</span><b>environ ' + eur(s.logement) + '</b></div>' +
      '</div>' +
      '<details><summary>Analyse détaillée</summary><div class="inner">' +
        '<p class="pro"><i data-lucide="plus"></i> ' + esc(s.plus) + '</p>' +
        '<p class="con"><i data-lucide="minus"></i> ' + esc(s.moins) + '</p>' +
        '<p class="tiny"><b>Sécurité :</b> ' + esc(s.securite) + '</p>' +
        '<p class="tiny"><b>Sur nos dates :</b> ' + esc(s.ouvertureNote) + '</p>' +
      '</div></details></article>').join("");
}

function renderPrestations(){
  const el = $("#prestaList"); if(!el) return;
  el.innerHTML = PRESTATIONS.map(p =>
    '<details><summary><span class="sum-label">' + esc(p.label) + '</span>' +
    '<span class="chip chip-mute">' + p.count + ' liens</span></summary>' +
    '<div class="inner"><p class="tiny">' + esc(p.note) + '</p><div class="links">' +
    p.liens.map(l =>
      '<a class="link" href="' + esc(l.u) + '" target="_blank" rel="noopener">' +
      '<span class="link-n">' + esc(l.n) + '</span>' +
      '<span class="link-d">' + esc(l.d) + '</span>' +
      '<i data-lucide="arrow-up-right"></i></a>').join("") +
    '</div></div></details>').join("");
}

function renderVote(){
  const el = $("#voteList"); if(!el) return;
  const counts = {};
  Object.entries(S.vote).forEach(entry => {
    const who = entry[0], list = entry[1];
    (list || []).forEach((c, j) => {
      if(!counts[c]) counts[c] = {pts:0, voters:[]};
      counts[c].pts += 3 - j;
      counts[c].voters.push(memName(who));
    });
  });
  const ranked = STATIONS.map(s => Object.assign({}, s, counts[s.id] || {pts:0, voters:[]}))
                         .sort((a, b) => b.pts - a.pts);
  const max = Math.max(1, ranked.map(r => r.pts).concat([1]));

  const mine = S.me && S.vote[S.me.id];
  const mineEl = $("#myVote");
  if(mineEl){
    mineEl.innerHTML = mine
      ? "Ton vote : " + mine.map(id => {
          const s = STATIONS.find(x => x.id === id);
          return s ? '<span class="chip chip-acc">' + esc(s.nom) + '</span>' : "";
        }).join(" ")
      : '<span class="tiny">Tu n\'as pas encore voté.</span>';
  }

  el.innerHTML = ranked.map(r =>
    '<div class="vote"><div class="vote-head"><b>' + esc(r.nom) + '</b>' +
    (r.best ? '<span class="chip chip-ok">conseillé</span>' : "") +
    '<span class="vote-pts">' + r.pts + ' pts</span></div>' +
    '<div class="bar" style="margin:6px 0 4px"><i style="width:' + Math.round(r.pts / max * 100) + '%"></i></div>' +
    '<p class="tiny">' + (r.voters.length ? esc(r.voters.join(" · ")) : "aucun vote") + '</p></div>').join("");
}

function renderDepenses(){
  const el = $("#depList"); if(!el) return;
  el.innerHTML = S.depenses.length ? S.depenses.map((d, i) =>
    '<div class="line"><span>' + esc(d.q) + '<span class="tiny"> · payé par ' + esc(d.p) + '</span></span>' +
    '<span class="line-r"><b>' + eur(d.m) + '</b>' +
    '<button class="btn ghost xs" data-act="del-dep" data-i="' + i + '"><i data-lucide="trash-2"></i></button></span></div>').join("")
    : '<p class="empty">Aucune dépense partagée pour l\'instant.</p>';

  const tot = S.depenses.reduce((a, d) => a + (+d.m || 0), 0);
  const part = tot / CFG.groupSize;
  const bal = {};
  S.members.forEach(m => { bal[memName(m.id)] = 0; });
  S.depenses.forEach(d => { if(d.p in bal) bal[d.p] += +d.m; });
  Object.keys(bal).forEach(k => { bal[k] -= part; });
  const deb = Object.entries(bal).filter(x => x[1] < -0.01).map(x => [x[0], -x[1]]);
  const cre = Object.entries(bal).filter(x => x[1] > 0.01).map(x => [x[0], x[1]]);
  const out = [];
  while(deb.length && cre.length){
    const m = Math.min(deb[0][1], cre[0][1]);
    out.push([deb[0][0], cre[0][0], m]);
    deb[0][1] -= m; cre[0][1] -= m;
    if(deb[0][1] < .01) deb.shift();
    if(cre[0][1] < .01) cre.shift();
  }
  const s = $("#depSettle");
  if(s) s.innerHTML = out.length
    ? '<div class="tot"><div class="tot-row"><span>Total partagé</span><b>' + eur(tot) + '</b></div>' +
      '<div class="tot-row"><span>Part de chacun</span><b>' + eur(part) + '</b></div></div>' +
      '<div class="settle">' + out.map(o =>
        '<div class="line"><span>' + esc(o[0]) + ' vers ' + esc(o[1]) + '</span><b>' + eur(o[2]) + '</b></div>').join("") + '</div>'
    : '<p class="empty">Rien à répartir tant que les prénoms ne sont pas remplis et les dépenses saisies.</p>';
}

function renderSlots(){
  const el = $("#slotList"); if(!el) return;
  el.innerHTML = S.slots.length ? S.slots.map(s =>
    '<div style="margin-bottom:12px"><div class="line">' +
    '<span><span class="ava-xs">' + esc(memEmoji(s.who)) + '</span> <b>' + esc(memName(s.who)) + '</b></span>' +
    '<span class="line-r"><span class="chip ' + (s.contribution < 150 ? "chip-hot" : "chip-ok") + '">' +
      eur(s.contribution) + '</span>' +
    '<button class="btn ghost xs" data-act="del-slot" data-who="' + s.who + '"><i data-lucide="trash-2"></i></button></span></div>' +
    (s.note ? '<p class="tiny">' + esc(s.note) + '</p>' : "") + '</div>').join("")
    : '<p class="empty">Personne n\'a encore rempli ses disponibilités.</p>';
}

function renderChat(){
  const el = $("#chatBox"); if(!el) return;
  el.innerHTML = S.chat.length ? S.chat.slice(-80).map(c =>
    '<div class="msg ' + (S.me && c.who === S.me.id ? "me" : "") + '">' +
    '<div class="msg-head"><span class="ava-xs">' + esc(memEmoji(c.who)) + '</span>' +
    '<b>' + esc(c.name) + '</b><time>' +
    new Date(c.at).toLocaleString("fr-FR", {day:"2-digit", month:"2-digit", hour:"2-digit", minute:"2-digit"}) +
    '</time></div><p>' + esc(c.msg) + '</p></div>').join("")
    : '<p class="empty">Aucun message. Lance la discussion.</p>';
  el.scrollTop = el.scrollHeight;
}

function readCheck(){
  if(!storeOk) return {};
  try { return JSON.parse(localStorage[CHECKKEY] || "{}"); } catch(e){ return {}; }
}

function renderChecklist(){
  const el = $("#checkList"); if(!el) return;
  const saved = readCheck();
  let total = 0, done = 0;
  el.innerHTML = CHECKLIST.map((g, gi) => {
    const items = g.items.map((it, ii) => {
      const k = gi + "_" + ii;
      total++; if(saved[k]) done++;
      return '<label class="tick ' + (saved[k] ? "done" : "") + '">' +
        '<input type="checkbox" ' + (saved[k] ? "checked" : "") +
        ' data-act="check" data-k="' + k + '"><span>' + esc(it) + '</span></label>';
    }).join("");
    return '<div class="checkgroup"><h4>' + esc(g.g) + '</h4>' + items + '</div>';
  }).join("");
  const h = $("#checkHead");
  if(h) h.innerHTML = '<span class="chip chip-acc">' + done + '/' + total + '</span>' +
    '<div class="bar" style="flex:1;margin:0"><i style="width:' + Math.round(done / total * 100) + '%"></i></div>';
}

function renderContacts(){
  const el = $("#contactList"); if(!el) return;
  el.innerHTML = CONTACTS.map(c =>
    '<a class="contact" href="tel:' + esc(c.p.replace(/\s/g, "")) + '">' +
    '<div><b>' + esc(c.n) + '</b><span class="tiny">' + esc(c.d) + '</span></div>' +
    '<span class="contact-num"><i data-lucide="phone"></i> ' + esc(c.p) + '</span></a>').join("");
}

function renderMemo(){
  const set = (id, v) => { const e = $("#" + id); if(e) e.textContent = v; };
  const bt = S.budget.reduce((a, b) => a + (+b.m || 0), 0);
  const nVotes = Object.keys(S.vote).length;
  set("memTasks", S.tasks.filter(t => t.done).length + " / " + S.tasks.length + " terminées");
  set("memBudget", S.budget.length + " poste" + (S.budget.length > 1 ? "s" : "") + " · " + eur(bt));
  set("memDep", S.depenses.length + " dépense" + (S.depenses.length > 1 ? "s" : ""));
  set("memVote", nVotes + " vote" + (nVotes > 1 ? "s" : "") + " sur 5");
  set("memChat", S.chat.length + " message" + (S.chat.length > 1 ? "s" : ""));
  set("memSlots", S.slots.length + " contribution" + (S.slots.length > 1 ? "s" : ""));
  set("memStore", storeOk ? "actif" : "indisponible");
  set("memWhen", new Date().toLocaleString("fr-FR", {day:"2-digit", month:"long", hour:"2-digit", minute:"2-digit"}));
}

function fillSelects(){
  const names = S.members.map(m =>
    '<option value="' + m.id + '">' + esc(memName(m.id)) + '</option>').join("");

  ["nbWho", "dp", "ntW"].forEach(id => {
    const e = $("#" + id); if(!e) return;
    const cur = e.value;
    e.innerHTML = (id === "ntW" ? '<option value="all">Tout le monde</option>' : "") + names;
    if(cur) e.value = cur;
  });

  const opts = STATIONS.map(s => '<option value="' + s.id + '">' + esc(s.nom) + '</option>').join("");
  const vote = S.me && S.vote[S.me.id];
  ["v1","v2","v3"].forEach((id, j) => {
    const e = $("#" + id); if(!e) return;
    if(e.options.length !== STATIONS.length) e.innerHTML = opts;
    if(vote && vote[j]){ e.value = vote[j]; }
    else if(!vote){ e.selectedIndex = j; }
  });
}

function identify(){
  const cur = S.me ? S.me.id : null;
  openModal("Qui es-tu ?",
    '<p class="tiny">Choisis ton emplacement dans le groupe. Tu pourras mettre ton prénom juste après.</p>' +
    '<div class="pick">' + S.members.map(m =>
      '<button class="pick-item ' + (cur === m.id ? "on" : "") + '" data-act="claim" data-id="' + m.id + '">' +
      '<span class="ava">' + esc(m.emoji) + '</span><b>' + esc(memName(m.id)) + '</b>' +
      (isNamed(m) ? "" : '<span class="chip chip-mute">libre</span>') + '</button>').join("") + '</div>');
}

function claim(id){
  S.me = {id:id, name:memName(id), emoji:memEmoji(id)};
  const m = mem(id);
  if(!isNamed(m)){
    closeModal();
    askName(id);
    return;
  }
  saveLocal(); push(); refreshAll(); closeModal();
  toast("Bienvenue " + memName(id), "ok");
}

function askName(id){
  const m = mem(id);
  openModal("Ton prénom",
    '<p class="tiny">Il apparaîtra partout : sur tes tâches, tes messages et tes votes.</p>' +
    '<label>Prénom</label><input id="fName" placeholder="Ex : David" maxlength="20" autocomplete="off">' +
    '<label>Âge</label><input id="fAge" type="number" min="16" max="99" placeholder="' + (m.age || "ex : 21") + '">' +
    '<label>Permis de conduire</label><input id="fPermit" placeholder="ex : français, 5 ans" value="' + esc(m.permit || "") + '">' +
    '<label>Rôle dans le projet</label><input id="fRole" placeholder="ex : je gère les forfaits" value="' + esc(m.role || "") + '">' +
    '<div class="modal-foot"><button class="btn ghost" data-act="close">Annuler</button>' +
    '<button class="btn" data-act="save-member" data-id="' + id + '">Enregistrer</button></div>');
  setTimeout(() => { const e = $("#fName"); if(e) e.focus(); }, 60);
}

function editMember(id){
  const m = mem(id); if(!m) return;
  openModal("Modifier la fiche",
    '<label>Prénom</label><input id="fName" value="' + esc(m.name || "") + '" placeholder="Ex : David" maxlength="20">' +
    '<label>Âge</label><input id="fAge" type="number" min="16" max="99" value="' + (m.age === null || m.age === undefined ? "" : m.age) + '">' +
    '<label>Permis de conduire</label><input id="fPermit" value="' + esc(m.permit || "") + '">' +
    '<label>Rôle dans le projet</label><input id="fRole" value="' + esc(m.role || "") + '">' +
    '<div class="modal-foot"><button class="btn ghost" data-act="close">Annuler</button>' +
    '<button class="btn" data-act="save-member" data-id="' + id + '">Enregistrer</button></div>');
  setTimeout(() => { const e = $("#fName"); if(e) e.focus(); }, 60);
}

function saveMember(id){
  const m = mem(id); if(!m) return;
  const nEl = $("#fName"), aEl = $("#fAge"), pEl = $("#fPermit"), rEl = $("#fRole");
  const n = (nEl.value || "").trim();
  m.name   = n;
  m.age    = aEl.value ? +aEl.value : null;
  m.permit = (pEl.value || "").trim();
  m.role   = (rEl.value || "").trim();
  if(S.me && S.me.id === id){ S.me.name = m.name || memName(id); S.me.emoji = m.emoji; }
  saveLocal(); push(); refreshAll(); closeModal();
  toast(m.name ? "Fiche de " + m.name + " enregistrée" : "Fiche enregistrée", "ok");
}

function toggleTask(id){
  const meM = S.me && mem(S.me.id);
  if(!isNamed(meM)){ toast("Choisis d'abord ton prénom", "warn"); identify(); return; }
  const t = S.tasks.find(x => x.id === id); if(!t) return;
  t.done = !t.done;
  t.by = t.done ? memName(S.me.id) : null;
  t.doneAt = t.done ? Date.now() : null;
  saveLocal(); push(); refreshAll();
  if(t.done) toast("Validé par " + memName(S.me.id), "ok");
}

function addTask(){
  const tEl = $("#ntT");
  const t = (tEl.value || "").trim();
  if(!t) return toast("Donne un intitulé", "warn");
  S.tasks.unshift({
    id:uid(), t, done:false,
    cat:$("#ntC").value, who:$("#ntW").value,
    prio:$("#ntP").value, d:+$("#ntD").value || 14,
    det:($("#ntDet").value || "").trim()
  });
  tEl.value = ""; $("#ntDet").value = "";
  saveLocal(); push(); refreshAll(); toast("Tâche ajoutée", "ok");
}

function addBudget(){
  const q = ($("#nbQ").value || "").trim(), m = +$("#nbM").value;
  if(!q || !m) return toast("Intitulé et montant obligatoires", "warn");
  S.budget.unshift({p:$("#nbP").value, q, m, who:$("#nbWho").value, s:$("#nbS").value});
  $("#nbQ").value = ""; $("#nbM").value = "";
  saveLocal(); push(); refreshAll(); toast("Dépense enregistrée", "ok");
}
function delBudget(i){ S.budget.splice(i, 1); saveLocal(); push(); refreshAll(); }

function castVote(){
  const meM = S.me && mem(S.me.id);
  if(!isNamed(meM)){ toast("Choisis d'abord ton prénom", "warn"); identify(); return; }
  const c = [$("#v1").value, $("#v2").value, $("#v3").value];
  if(new Set(c).size < 3) return toast("Choisis 3 stations différentes", "warn");
  S.vote[S.me.id] = c;
  saveLocal(); push(); refreshAll(); toast("Vote enregistré", "ok");
}

function addShare(){
  const q = ($("#dq").value || "").trim(), m = +$("#dm").value;
  if(!q || !m) return toast("Intitulé et montant obligatoires", "warn");
  S.depenses.push({p:memName($("#dp").value), q, m});
  $("#dq").value = ""; $("#dm").value = "";
  saveLocal(); push(); refreshAll(); toast("Dépense ajoutée", "ok");
}
function delShare(i){ S.depenses.splice(i, 1); saveLocal(); push(); refreshAll(); }

function addSlot(){
  const meM = S.me && mem(S.me.id);
  if(!isNamed(meM)){ toast("Choisis d'abord ton prénom", "warn"); identify(); return; }
  const v = +$("#slV").value || 0;
  S.slots = S.slots.filter(x => x.who !== S.me.id);
  S.slots.push({who:S.me.id, contribution:v, note:($("#slN").value || "").trim()});
  $("#slV").value = ""; $("#slN").value = "";
  saveLocal(); push(); refreshAll(); toast("Enregistré", "ok");
}
function delSlot(who){ S.slots = S.slots.filter(x => x.who !== who); saveLocal(); push(); refreshAll(); }

function send(){
  const meM = S.me && mem(S.me.id);
  if(!isNamed(meM)){ toast("Choisis d'abord ton prénom", "warn"); identify(); return; }
  const v = ($("#msgIn").value || "").trim(); if(!v) return;
  S.chat.push({who:S.me.id, name:memName(S.me.id), msg:v, at:Date.now()});
  $("#msgIn").value = "";
  saveLocal(); push(); refreshAll();
}

function tickCheck(k){
  if(!storeOk) return toast("Stockage indisponible sur cet appareil", "warn");
  const s = readCheck();
  s[k] = !s[k];
  try { localStorage[CHECKKEY] = JSON.stringify(s); } catch(e){}
  renderChecklist();
  icons();
}

function exportMemo(){
  const blob = new Blob([JSON.stringify({
    room:CFG.room, exported:new Date().toISOString(),
    members:S.members, tasks:S.tasks, budget:S.budget,
    depenses:S.depenses, vote:S.vote, chat:S.chat, slots:S.slots
  }, null, 2)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "ski-italie-memoire-" + new Date().toISOString().slice(0,10) + ".json";
  a.click();
  toast("Mémoire exportée", "ok");
}

function resetAll(){
  openModal("Tout réinitialiser ?",
    '<p>Les données de cet appareil seront effacées : membres, tâches, budget, votes, messages et check-list.</p>' +
    '<p class="tiny">Si le partage est activé, les données du groupe ne sont pas touchées.</p>' +
    '<div class="modal-foot"><button class="btn ghost" data-act="close">Annuler</button>' +
    '<button class="btn danger" data-act="confirm-reset">Effacer</button></div>');
}
function doReset(){
  try { localStorage.removeItem(LSKEY); localStorage.removeItem(CHECKKEY); } catch(e){}
  location.reload();
}

function openModal(title, html){
  let m = $("#modal");
  if(!m){ m = document.createElement("div"); m.id = "modal"; document.body.appendChild(m); }
  m.innerHTML = '<div class="modal-back" data-act="close"></div>' +
    '<div class="modal-box" role="dialog" aria-modal="true">' +
    '<div class="modal-head"><h3>' + esc(title) + '</h3>' +
    '<button class="btn ghost xs" data-act="close" aria-label="Fermer"><i data-lucide="x"></i></button></div>' +
    '<div class="modal-body">' + html + '</div></div>';
  m.classList.add("on");
  document.body.style.overflow = "hidden";
  icons();
}
function closeModal(){
  const m = $("#modal");
  if(m){ m.classList.remove("on"); m.innerHTML = ""; }
  document.body.style.overflow = "";
}

document.addEventListener("click", e => {
  const el = e.target.closest("[data-act]");
  if(!el) return;
  const a = el.dataset.act, i = el.dataset.i, id = el.dataset.id, who = el.dataset.who;
  if(a === "identify")          identify();
  else if(a === "claim")        claim(id);
  else if(a === "edit-member")  editMember(id);
  else if(a === "save-member")  saveMember(id);
  else if(a === "close")        closeModal();
  else if(a === "confirm-reset")doReset();
  else if(a === "del-budget")   delBudget(+i);
  else if(a === "del-dep")      delShare(+i);
  else if(a === "del-slot")     delSlot(who);
});

document.addEventListener("change", e => {
  const el = e.target.closest("[data-act]");
  if(!el) return;
  if(el.dataset.act === "toggle-task") toggleTask(el.dataset.id);
  if(el.dataset.act === "check")       tickCheck(el.dataset.k);
});

document.addEventListener("click", e => {
  const b = e.target.closest(".filter-bar button");
  if(!b) return;
  $$(".filter-bar button").forEach(x => x.classList.remove("on"));
  b.classList.add("on");
  S.filter = b.dataset.filter;
  renderTasks();
  icons();
});

function wire(){
  const on = (sel, ev, fn) => { const e = $(sel); if(e) e.addEventListener(ev, fn); };
  on("#btnIdentify", "click", identify);
  on("#btnAddTask", "click", addTask);
  on("#btnAddBudget", "click", addBudget);
  on("#btnVote", "click", castVote);
  on("#btnAddShare", "click", addShare);
  on("#btnAddSlot", "click", addSlot);
  on("#btnSend", "click", send);
  on("#btnExport", "click", exportMemo);
  on("#btnPrint", "click", () => window.print());
  on("#btnReset", "click", resetAll);
  on("#msgIn", "keydown", e => { if(e.key === "Enter") send(); });

  const links = $$(".tabs a");
  const secs = links.map(a => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  if("IntersectionObserver" in window){
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if(en.isIntersecting){
          links.forEach(l => l.classList.toggle("on", l.getAttribute("href") === "#" + en.target.id));
        }
      });
    }, {rootMargin:"-30% 0px -60% 0px"});
    secs.forEach(s => io.observe(s));
  }
}

(async function start(){
  await boot();
  wire();
  refreshAll();
  window.addEventListener("beforeunload", saveLocal);
})();
