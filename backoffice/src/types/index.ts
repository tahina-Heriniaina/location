export interface Administrateur {
  idadmin: number;
  nomadmin: string;
  prenomadmin: string;
  emailadmin: string;
  codeacces: string;
  role: string;
}

export interface Client {
  idclient: number;
  nomclient: string;
  prenomclient: string;
  emailclient: string;
  telclient: string;
  addresclient: string;
}

export interface Chauffeur {
  idchauffeur: number;
  nomchauffeur: string;
  telchauffeur: string;
  photochauf?: string;
}

export interface Voiture {
  idvoiture: number;
  nomvoiture: string;
  categorie: 'car' | 'moto' | 'truck';
  nombre_places: number;
  prixparjour: number;
  photo?: string;
  description?: string;
  localisation?: string;
  equipement?: string;
  idchauffeur?: number;
  chauffeur?: Chauffeur;
}

export interface Reservation {
  idreservation: number;
  idclient: number;
  idvoiture: number;
  datedebut: string;
  datefin: string;
  heuredebut?: string;
  heurefin?: string;
  lieulocation?: string;
  prixtotal: number;
  statut: 'EN_ATTENTE' | 'CONFIRMEE' | 'ANNULEE' | 'TERMINEE';
  client?: Client;
  voiture?: Voiture;
}

export interface Paiement {
  idpaiement: number;
  idreservation: number;
  montant: number;
  modepaiement?: string;
  datepaiement: string;
  statutpaiement: 'EN_ATTENTE' | 'PAYE' | 'REMBOURSE';
  reservation?: Reservation;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface ReservationStat {
  statut: string;
  total: number;
}

export interface RecentActivityItem {
  type: 'reservation' | 'client' | 'voiture';
  message: string;
  dateconsultation: string;
}

export interface MonthlyReservation {
  mois: string;  
  total: number;
}


export interface Statistics {
  totalClients: number;
  totalVoitures: number;
  totalReservations: number;
  revenus: number;
  reservationsParStatut?: ReservationStat[];
  recentActivity?: RecentActivityItem[];
  reservationsParMois?: MonthlyReservation[];
}