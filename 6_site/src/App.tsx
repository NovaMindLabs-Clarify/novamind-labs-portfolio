import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/shared/Layout';
import { AppShell } from './pages/AppShell';
import { BookingWizard } from './pages/booking/BookingWizard';
import { Confirmation } from './pages/booking/Confirmation';
import { ManageBooking } from './pages/booking/ManageBooking';
import { StaffPicker } from './pages/staff/StaffPicker';
import { StaffDashboard } from './pages/staff/StaffDashboard';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminOverview } from './pages/admin/AdminOverview';
import { AdminServices } from './pages/admin/AdminServices';
import { AdminStaff } from './pages/admin/AdminStaff';
import { AdminBookings } from './pages/admin/AdminBookings';

export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<AppShell />} />
          <Route path="book" element={<BookingWizard />} />
          <Route path="book/confirmation/:code" element={<Confirmation />} />
          <Route path="manage/:code?" element={<ManageBooking />} />

          <Route path="staff" element={<StaffPicker />} />
          <Route path="staff/:barberId" element={<StaffDashboard />} />

          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="staff" element={<AdminStaff />} />
            <Route path="bookings" element={<AdminBookings />} />
          </Route>
        </Route>
      </Routes>
    </HashRouter>
  );
}
