import React, { useEffect, useState } from 'react';
import { Card } from '../components/UI/Card';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchStatistics } from '../store/slices/statisticsSlice';
import { Users, Car, Calendar, DollarSign, ArrowUp, Zap } from 'lucide-react';
import axios from 'axios';

// Chemins d'icônes existants
import cashIcon from '../../public/assets/images/especes.png';
import walletIcon from '../../public/assets/images/wallet.png';
import orangeIcon from '../../public/assets/images/orange.png';
import mvolaIcon from '../../public/assets/images/mvola.png';
import cardIcon from '../../public/assets/images/master.png';

// Fonction utilitaire existante pour afficher le temps relatif (NON MODIFIÉE)
const timeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return `il y a ${diff} sec`;
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`;
  return `il y a ${Math.floor(diff / 86400)} j`;
};

// Types de données (NON MODIFIÉS)
type GeneralCard = {
  type: 'general';
  name: string;
  value: number | string;
  icon: React.ComponentType<any>;
  color: string;
};

type PaiementCard = {
  type: 'paiement';
  label: string;
  value: number;
  icon: string;
  color: string;
};

interface PaiementStats {
  revenus: number;
  cash: number;
  wallet: number;
  orange: number;
  mvola: number;
  card: number;
  totalPaiements: number;
}

// **COULEUR PRINCIPALE DU THÈME**
const THEME_COLOR = 'bg-[#00cc00]';
const TEXT_THEME_COLOR = 'text-[#00cc00]';
const SHADOW_THEME_COLOR = 'shadow-green-400/30';

// NOUVEAU COMPOSANT : Carte d'Activité Améliorée (Corrigée)
const ActivityItem: React.FC<any> = ({ item }) => {
  const activityColor = item.type === 'reservation' ? '#00cc00' : item.type === 'client' ? '#007bff' : '#ffc107';
  const ActivityIconComponent = item.type === 'reservation' ? Zap : item.type === 'client' ? Users : Calendar;

  return (
    <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition border-l-4" style={{ borderColor: activityColor }}>
      <div className="flex-shrink-0 pt-1">
        <ActivityIconComponent className="w-4 h-4" style={{ color: activityColor }} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-800 leading-tight">
          {item.message}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          {timeAgo(item.dateconsultation)}
        </p>
      </div>
    </div>
  );
};


export const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: statistics, loading } = useAppSelector((state) => state.statistics);
  const [paiementStats, setPaiementStats] = useState<PaiementStats | null>(null);

  // LOGIQUE EXISTANTE (NON MODIFIÉE)
  useEffect(() => {
    dispatch(fetchStatistics({}));
    const fetchPaiementStats = async () => {
      try {
        const res = await axios.get('http://localhost:3000/paiements/stats');
        setPaiementStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPaiementStats();
  }, [dispatch]);

  // CONFIGURATION DES CARTES
  const generalCards: GeneralCard[] = [
    { type: 'general', name: 'Total Clients', value: statistics?.totalClients || 0, icon: Users, color: 'bg-indigo-500' },
    { type: 'general', name: 'Total Voitures', value: statistics?.totalVoitures || 0, icon: Car, color: 'bg-orange-500' },
    { type: 'general', name: 'Réservations', value: statistics?.totalReservations || 0, icon: Calendar, color: 'bg-blue-500' },
    { type: 'general', name: 'Revenus', value: `${statistics?.revenus?.toLocaleString('fr-FR') || 0} Ar`, icon: DollarSign, color: THEME_COLOR },
  ];

  const paiementCards: PaiementCard[] = [
    { type: 'paiement', label: 'Espèce', value: paiementStats?.cash || 0, icon: cashIcon, color: 'bg-red-500' },
    { type: 'paiement', label: 'Wallet', value: paiementStats?.wallet || 0, icon: walletIcon, color: 'bg-indigo-500' },
    { type: 'paiement', label: 'Orange', value: paiementStats?.orange || 0, icon: orangeIcon, color: 'bg-orange-400' },
    { type: 'paiement', label: 'MVola', value: paiementStats?.mvola || 0, icon: mvolaIcon, color: 'bg-[#3b7e7e]' },
    { type: 'paiement', label: 'Card', value: paiementStats?.card || 0, icon: cardIcon, color: 'bg-blue-700' },
  ];

  const GeneralCardComponent: React.FC<GeneralCard> = ({ name, value, icon: Icon, color }) => (
    <Card
      
      className={`p-4 shadow-lg ${SHADOW_THEME_COLOR} border-b-4 border-transparent hover:border-[#00cc00] rounded-xl transition-all duration-300 transform hover:translate-y-[-2px] bg-white`}
    >
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">
            {name}
          </p>
         
          <p className="text-2xl font-extrabold text-gray-900">
            {value}
          </p>
        </div>
        
        <div className={`p-2 rounded-xl ${color} shadow-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      {/* Footer conservé, mais plus compact */}
      <div className="flex items-center mt-2 border-t pt-2 border-gray-100">
        <span className={`text-xs ${TEXT_THEME_COLOR} font-bold flex items-center`}>
          <ArrowUp className="w-3 h-3 mr-1" />
          +55%
        </span>
        <span className="text-xs text-gray-500 ml-2">Total MTD</span>
      </div>
    </Card>
  );

  
  const PaiementCardComponent: React.FC<PaiementCard> = ({ label, value, icon, color }) => (
    <Card
      
      className="p-4 shadow-md border-2 border-transparent hover:border-gray-200 rounded-xl transition-all duration-200 bg-white cursor-pointer"
    >
     
      <div className="flex flex-col space-y-2">
       
        <div className={`p-2 w-max rounded-full ${color} shadow-lg`}>
          <img src={icon} alt={label} className="w-4 h-4" />
        </div>
        
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {label}
        </p>
        
        <p className="text-lg font-bold text-gray-900">
          {value.toLocaleString('fr-FR')} Ar
        </p>
      </div>
    </Card>
  );

  return (
    // Réduction du padding global (p-6 au lieu de p-8)
    <div className="flex flex-col p-6 min-h-screen bg-gray-50 transition-all duration-300">
      
      {/* Header */}
      <div className="mb-8"> 
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight"> {/* Réduction de la taille du titre */}
          Tableau de bord
        </h1>
        <p className="text-gray-500 text-base mt-1">
          Aperçu des performances de votre agence de location
        </p>
      </div>

      {/* Cartes générales (Top Row) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6"> 
        {generalCards.map((card, idx) => (
          <GeneralCardComponent key={idx} {...card} />
        ))}
      </div>

      {/* Cartes paiements (Middle Row) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        {paiementCards.map((card, idx) => (
          <PaiementCardComponent key={idx} {...card} />
        ))}
      </div>

      {/* Graphiques & Activité (Bottom Section) */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Réservations par statut */}
        <Card title="Réservations par statut" className="flex-1 p-5 bg-white rounded-xl shadow-lg border border-gray-100"> 
          {/* Réduction de la taille du titre */}{loading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-full"></div>
              <div className="h-4 bg-gray-100 rounded w-5/6"></div>
              <div className="h-4 bg-gray-100 rounded w-4/6"></div>
            </div>
          ) : (
            <div className="space-y-1">
              {statistics?.reservationsParStatut?.map((item: any) => (
                <div
                  key={item.statut}
                  className="flex justify-between items-center p-2 rounded-lg transition"
                  style={{
                    backgroundColor: item.statut === 'CONFIRMEE' ? 'rgba(0, 204, 0, 0.08)' : 'bg-gray-50',
                    borderLeft: item.statut === 'CONFIRMEE' ? '4px solid #00cc00' : '4px solid transparent',
                  }}
                >
                  <span className="text-gray-700 text-sm font-medium uppercase">
                    {item.statut}
                  </span>
                  <span className={`text-lg font-extrabold ${item.statut === 'CONFIRMEE' ? TEXT_THEME_COLOR : 'text-gray-900'}`}>
                    {item.total}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Activité récente */}
        <Card title="Activité récente" className="flex-1 p-5 bg-white rounded-xl shadow-lg border border-gray-100 h-[400px] overflow-y-auto"> 
          
          {loading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-full"></div>
              <div className="h-4 bg-gray-100 rounded w-5/6"></div>
              <div className="h-4 bg-gray-100 rounded w-4/6"></div>
            </div>
          ) : (
            <div className="space-y-2">
              {statistics?.recentActivity?.map((item: any, idx: number) => (
                <ActivityItem key={idx} item={item} />
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};