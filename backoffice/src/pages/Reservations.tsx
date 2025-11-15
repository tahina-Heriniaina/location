import React, { useEffect, useState } from 'react';
import { Card } from '../components/UI/Card';
import { Table } from '../components/UI/Table';
import { Pagination } from '../components/UI/Pagination';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchReservations, updateReservationStatus } from '../store/slices/reservationSlice';
import { updateHistoryItemStatus } from '../../../frontend/store/slices/historySlice';
import {
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  MoreVertical,
  Search,
  Clock,
  Archive,
  Check,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const Reservations: React.FC = () => {
  const dispatch = useAppDispatch();
  const { reservations, loading, total, page, limit } = useAppSelector(
    (state) => state.reservation
  );

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [openRow, setOpenRow] = useState<number | null>(null);

  const MODE = 'ACTIVE';

  useEffect(() => {

    const loadReservations = () => {
    dispatch(fetchReservations({ page, limit, search, statut: statusFilter }));
    }

    loadReservations();

    const intervalId = setInterval(loadReservations, 5000);

    return () => clearInterval(intervalId);
    
  }, [dispatch, page, search, statusFilter]);

  const mapStatus = (backendStatus: string): 'en cours' | 'terminée' | 'annulée' => {
    switch (backendStatus) {
      case 'CONFIRMEE':
        return 'en cours';
      case 'TERMINEE':
        return 'terminée';
      case 'ANNULEE':
        return 'annulée';
      default:
        return 'en cours';
    }
  };

 


const handleStatusUpdate = async (id: number, backendStatus: string, clientId: number) => {
  try {
    // stocker la réservation mise à jour
    const updatedReservation = await dispatch(
      updateReservationStatus({ id, statut: backendStatus, clientId })
    ).unwrap();

    // mettre à jour le status dans le historySlice
    dispatch(updateHistoryItemStatus({
      id: updatedReservation.idreservation.toString(),
      status: mapStatus(updatedReservation.statut)
    }));

    //  recharger la liste
     dispatch(fetchReservations({ page, limit, search, statut: statusFilter }));

  } catch (error) {
    console.error('Erreur update status:', error);
  }
};



  const getStatusBadge = (statut: string) => {
    const base = 'flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold';
    switch (statut) {
      case 'EN_ATTENTE':
        return (
          <span className={`${base} bg-yellow-50 text-yellow-700`}>
            <Clock className="h-3.5 w-3.5" /> En attente
          </span>
        );
      case 'CONFIRMEE':
        return (
          <span className={`${base} bg-green-50 text-green-700`}>
            <CheckCircle className="h-3.5 w-3.5" /> Confirmée
          </span>
        );
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
        <div className="relative">
          <button
            onClick={() => setOpenRow(openRow === reservation.idreservation ? null : reservation.idreservation)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <MoreVertical className="h-5 w-5 text-gray-600" />
          </button>

          {openRow === reservation.idreservation && (
            <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-44 animate-slide-in z-10">
              {(reservation.statut === 'EN_ATTENTE' || reservation.statut === 'CONFIRMEE') && (
  <>
    {reservation.statut === 'EN_ATTENTE' && (
      <button
        onClick={() =>
          handleStatusUpdate(reservation.idreservation, 'CONFIRMEE', reservation.client.idclient)
        }
        className="flex items-center w-full text-left text-sm text-gray-800 hover:bg-green-50 hover:text-[#00cc00] rounded-md px-3 py-2 transition"
      >
        <Check className="h-4 w-4 mr-2" /> Accepter
      </button>
    )}

    <button
      onClick={() =>
        handleStatusUpdate(reservation.idreservation, 'ANNULEE', reservation.client.idclient)
      }
      className="flex items-center w-full text-left text-sm text-gray-800 hover:bg-red-50 hover:text-red-600 rounded-md px-3 py-2 transition"
    >
      <XCircle className="h-4 w-4 mr-2" /> Refuser / Annuler
    </button>

    <button
      onClick={() =>
        handleStatusUpdate(reservation.idreservation, 'TERMINEE', reservation.client.idclient)
      }
      className="flex items-center w-full text-left text-sm text-gray-800 hover:bg-blue-50 hover:text-blue-600 rounded-md px-3 py-2 transition"
    >
      <Archive className="h-4 w-4 mr-2" /> Terminer
    </button>
  </>
)}

            </div>
          )}
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
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Réservations</h1>
          <p className="text-gray-500 text-sm">
            Gérez vos réservations en toute simplicité — validez, terminez ou archivez.
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
              placeholder="Rechercher une réservation..."
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
            <option value="">Tous les statuts</option>
            <option value="EN_ATTENTE">En attente</option>
            <option value="CONFIRMEE">Confirmée</option>
            <option value="ANNULEE">Annulée</option>
            <option value="TERMINEE">Terminée</option>
          </select>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          data={reservations}
          loading={loading}
          emptyMessage="Aucune réservation trouvée"
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

      {/* Animation CSS */}
      <style>
        {`
          @keyframes slide-in {
            0% { opacity: 0; transform: translateY(-10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-slide-in {
            animation: slide-in 0.25s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};
