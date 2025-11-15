import React, { useEffect, useState } from 'react';
import { Card } from '../components/UI/Card';
import { Table } from '../components/UI/Table';
import { Pagination } from '../components/UI/Pagination';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchReservations } from '../store/slices/reservationSlice';
import {
 Archive,
 XCircle,
 Calendar,
 DollarSign,
 Search,
Clock,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';


export const ReservationsArchive: React.FC = () => {
 const dispatch = useAppDispatch();
 const { reservations, loading, total, page, limit } = useAppSelector(
 (state) => state.reservation
 );

  const [search, setSearch] = useState('');

 const [statusFilter, setStatusFilter] = useState(''); 
 const [openRow, setOpenRow] = useState<number | null>(null);

 //  Le mode 'ARCHIVE' sera passé à l'action Redux
 const MODE = 'ARCHIVE';

 useEffect(() => {
 const loadReservations = () => {
 //  Passer le mode 'ARCHIVE' pour charger les bons statuts par défaut (voir étape 2)
   dispatch(fetchReservations({ page, limit, search, statut: statusFilter, mode: MODE  }));
 }

 loadReservations();

 const intervalId = setInterval(loadReservations, 5000);

 return () => clearInterval(intervalId);
 }, [dispatch, page, limit, search, statusFilter]);
  
// NOTE : mapStatus et getStatusBadge peuvent rester inchangés s'ils sont dans le même fichier
// ou s'ils sont importés d'un fichier utilitaire. Si vous les copiez/collez :

  const getStatusBadge = (statut: string) => {
    const base = 'flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold';
     switch (statut) {
    case 'ANNULEE':
     return (
       <span className={`${base} bg-red-50 text-red-700`}>
       <XCircle className="h-3.5 w-3.5" /> Annulée
        </span>
      );
      case 'TERMINEE':
      return (
       <span className={`${base} bg-blue-50 text-blue-700`}>
         <Archive className="h-3.5 w-3.5" /> Terminée
        </span>
       );
      default:
       return <span className={`${base} bg-gray-50 text-gray-700`}>{statut}</span>;
    }
  };

  const columns = [
    // Colonnes Client, Voiture, Dates, Prix total (identiques à Reservations.tsx)
   {
     key: 'client',
     title: 'Client',
    render: (_: any, reservation: any) => (
      <div>
        <p className="font-semibold text-gray-900">
         {reservation.client?.nomclient} {reservation.client?.prenomclient}
    </p>
      <p className="text-sm text-gray-500">{reservation.client?.emailclient}</p>
     </div>
    ),
    },
      {
      key: 'voiture',
      title: 'Voiture',
     render: (_: any, reservation: any) => (
      <div>
       <p className="font-medium text-gray-900">{reservation.voiture?.nomvoiture}</p>
       <p className="text-sm text-gray-500 capitalize">{reservation.voiture?.categorie}</p>
     </div>
       ),
     },
     {
    key: 'dates',
     title: 'Dates',
    render: (_: any, reservation: any) => (
     <div className="flex items-center">
    <Calendar className="h-4 w-4 mr-2 text-[#00cc00]" />
      <div>
       <p className="text-sm font-medium text-gray-800">
      {format(new Date(reservation.datedebut), 'dd MMM yyyy', { locale: fr })}
        </p>
        <p className="text-xs text-gray-500">
        au {format(new Date(reservation.datefin), 'dd MMM yyyy', { locale: fr })}
       </p>
      </div>
     </div>
    ),
    },
    {
    key: 'prixtotal',
    title: 'Prix total',
    render: (value: number) => (
      <div className="flex items-center font-semibold text-[#00cc00]">
       <DollarSign className="h-4 w-4 mr-1" />
       {value.toLocaleString()} Ar
      </div>
     ),
   },
    {
     key: 'statut',
     title: 'Statut',
    render: (statut: string) => getStatusBadge(statut),
   },
     {
     key: 'actions',
      title: '',
    render: (_: any, reservation: any) => (
        <div className="text-sm text-gray-500">
            {/*  Les archives sont consultables mais non modifiables */}
            Archivée
         </div>
      ),
    },
  ];

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
      <h1 className="text-3xl font-bold text-gray-900">Réservations Archivées</h1>
       <p className="text-gray-500 text-sm">
         Historique des réservations annulées et terminées.
      </p>
      </div>
      </div>

       {/* Card principale */}
       <Card className="shadow-xl border border-gray-200 rounded-2xl transition-all hover:shadow-2xl bg-white">
        {/* Filtres */}
         <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
         <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
             type="text"
             placeholder="Rechercher une réservation archivée..."
               value={search}
            onChange={(e) => setSearch(e.target.value)}
           className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00cc00] focus:border-transparent transition"
           />
          </div>

            <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00cc00] focus:border-transparent transition text-gray-700"
           >
            <option value="">Toutes les archives</option>
           <option value="ANNULEE">Annulée</option>
          <option value="TERMINEE">Terminée</option>
       </select>
        </div>

         {/* Table */}
         <Table
          columns={columns}
          data={reservations}
          loading={loading}
         emptyMessage="Aucune archive trouvée"
         />
       {/* Pagination */}
         {totalPages > 1 && (
          <Pagination
           currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage) =>
          dispatch(fetchReservations({ page: newPage, limit, search, statut: statusFilter, mode: MODE }))
          }
       />
       )}
     </Card>

     {/* ... Style ... */}
 </div>
 );
};