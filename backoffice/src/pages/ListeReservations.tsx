import React, { useEffect, useState } from "react";
import { Card } from "../components/UI/Card";
import { Pagination } from "../components/UI/Pagination";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { fetchReservations } from "../store/slices/reservationSlice";
import { Calendar, DollarSign, Search, Filter, User } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const ListeReservations: React.FC = () => {
  const dispatch = useAppDispatch();
  const { reservations, loading, total, page, limit } = useAppSelector(
    (state) => state.reservation
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState('');


  useEffect(() => {
    dispatch(fetchReservations({ page, limit, search, categorie: categoryFilter }));
  }, [dispatch, page, search, statusFilter, categoryFilter]);

 

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Liste des réservations
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Consultez et gérez les réservations facilement.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 text-right">
            <p className="text-gray-500 text-sm">Total</p>
            <p className="text-xl font-bold text-[#00cc00]">{total}</p>
          </div>
        </div>

        {/* Filtres */}
        <Card className="bg-white border border-gray-200 shadow-md rounded-xl p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-between mb-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher une réservation..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-white text-gray-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00cc00] focus:border-transparent text-sm"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 bg-white text-gray-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00cc00] focus:border-transparent text-sm"
              >
                 <option value="">Toutes les catégories</option>
    <option value="car">Car</option>
    <option value="moto">Moto</option>
    <option value="truck">Truck</option>
              </select>
            </div> 
          </div>

          {/* Grille */}
          {loading ? (
            <div className="text-center text-gray-500 py-8">Chargement...</div>
          ) : reservations.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Aucune réservation trouvée.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {reservations.map((reservation: any) => {
                const voiture = reservation.voiture;
                const photoUrl = voiture?.photo
                  ? voiture.photo.startsWith("/")
                    ? `http://localhost:3000${voiture.photo}`
                    : voiture.photo
                  : "/no-image.jpg";

                return (
                  <div
                    key={reservation.idreservation}
                    className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-lg transition-transform transform hover:-translate-y-1 overflow-hidden flex flex-col"
                  >
                    {/* Image */}
                    <div className="relative w-full h-36 overflow-hidden">
                      <img
                        src={photoUrl}
                        alt={voiture?.nomvoiture || "Voiture"}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    {/*}  <div className="absolute top-2 right-2">
                        {getStatusBadge(reservation.statut)}
                      </div>  */}
                    </div>

                    {/* Contenu */}
                    <div className="p-4 flex flex-col flex-grow">
                      {/* Client */}
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-[#00cc00]" />
                        <div>
                          <p className="font-medium text-gray-800 text-sm">
                            {reservation.client?.nomclient}{" "}
                            {reservation.client?.prenomclient}
                          </p>
                          <p className="text-xs text-gray-500">
                            {reservation.client?.emailclient}
                          </p>
                        </div>
                      </div>

                      {/* Voiture */}
                      <div className="mb-2">
                        <p className="font-semibold text-gray-900 text-sm">
                          {voiture?.nomvoiture}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {voiture?.categorie}
                        </p>
                      </div>

                      {/* Dates */}
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-[#00cc00]" />
                        <div>
                          <p className="text-xs text-gray-700">
                            {format(new Date(reservation.datedebut), "dd MMM yyyy", { locale: fr })}
                            {" - "}
                            {format(new Date(reservation.datefin), "dd MMM yyyy", { locale: fr })}
                          </p>
                        </div>
                      </div>

                      {/* Prix */}
                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                        <div className="flex items-center text-[#00cc00] font-semibold text-sm">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {reservation.prixtotal?.toLocaleString()} Ar
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-5 flex justify-center">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(newPage) =>
                  dispatch(
                    fetchReservations({
                      page: newPage,
                      limit,
                      search,
                      statut: statusFilter,
                    })
                  )
                }
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
