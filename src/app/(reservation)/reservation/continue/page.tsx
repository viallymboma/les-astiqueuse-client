import { Suspense } from "react";
import ReservationStep2 from "../_components/ReservationStep2";

const ContinueReservation = () => {
  
    return (
      <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6eaad0]"></div>
      </div>
    }>
        <ReservationStep2 />
      </Suspense>
    );
  };

export default ContinueReservation;
