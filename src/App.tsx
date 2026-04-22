import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import WellbeingSpaces from "./pages/WellbeingSpaces.tsx";
import RoomsOverview from "./pages/RoomsOverview.tsx";
import RoomsDetails from "./pages/RoomsDetails.tsx";
import CulinaryNourishment from "./pages/CulinaryNourishment.tsx";
import FamiliesWellbeing from "./pages/FamiliesWellbeing.tsx";
import JournalsStories from "./pages/JournalsStories.tsx";
import JournalDetail from "./pages/JournalDetail.tsx";
import RetreatFinder from "./pages/RetreatFinder.tsx";
// REMOVED: RetreatDetails — superseded by RetreatDetailsV2. To restore: uncomment this import and swap the /retreats/:id route element back to <RetreatDetails />.
// import RetreatDetails from "./pages/RetreatDetails.tsx";
import ActivityDetails from "./pages/ActivityDetails.tsx";
import WellnessAdvisor from "./pages/WellnessAdvisor.tsx";
import WellnessAdvisorProfile from "./pages/WellnessAdvisorProfile.tsx";
import WhyJayasomResidences from "./pages/WhyJayasomResidences.tsx";
import ResidentialCommunity from "./pages/ResidentialCommunity.tsx";
import AmaalaResidencesOverview from "./pages/AmaalaResidencesOverview.tsx";
import ResidenceDetails from "./pages/ResidenceDetails.tsx";
// REMOVED: MasterplansSitemaps page — to restore: uncomment this import and the /masterplans-sitemaps route below.
// import MasterplansSitemaps from "./pages/MasterplansSitemaps.tsx";
import TreatmentsListing from "./pages/TreatmentsListing.tsx";
import TreatmentDetails from "./pages/TreatmentDetails.tsx";
// REMOVED: DigitalBrochure page — to restore: uncomment this import and the /digital-brochure route below.
// import DigitalBrochure from "./pages/DigitalBrochure.tsx";
import RetreatDetailsV2 from "./pages/RetreatDetailsV2.tsx";
import RetreatDetailsAsAPair from "./pages/RetreatDetailsAsAPair.tsx";
import FamilyRetreatInclusions from "./pages/FamilyRetreatInclusions.tsx";

const queryClient = new QueryClient();

// REMOVED-PAGE redirect: forwards legacy /retreats/:id URLs to the V2 route so old links/bookmarks keep working.
const RetreatDetailsRedirect = () => {
  const { id } = useParams();
  return <Navigate to={`/retreats-v2/${id}`} replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/wellbeing-spaces" element={<WellbeingSpaces />} />
          <Route path="/rooms-villas" element={<RoomsOverview />} />
          <Route path="/rooms-villas/:id" element={<RoomsDetails />} />
          <Route path="/culinary-nourishment" element={<CulinaryNourishment />} />
          <Route path="/families-wellbeing" element={<FamiliesWellbeing />} />
          <Route path="/journals-stories" element={<JournalsStories />} />
          <Route path="/journals-stories/:id" element={<JournalDetail />} />
          <Route path="/retreat-finder" element={<RetreatFinder />} />
          {/* REMOVED: element was <RetreatDetails />. Redirected to V2. To restore original page, swap element back to <RetreatDetails />. */}
          <Route path="/retreats/:id" element={<RetreatDetailsRedirect />} />
          <Route path="/retreats-v2/:id" element={<RetreatDetailsV2 />} />
          {/* Unlisted preview — not linked from any nav. Direct URL only. */}
          <Route path="/retreats-as-a-pair" element={<RetreatDetailsAsAPair />} />
          <Route path="/activity-details" element={<ActivityDetails />} />
          <Route path="/wellness-advisor" element={<WellnessAdvisor />} />
          <Route path="/wellness-advisor/:id" element={<WellnessAdvisorProfile />} />
          <Route path="/why-jayasom-residences" element={<WhyJayasomResidences />} />
          <Route path="/residential-community" element={<ResidentialCommunity />} />
          <Route path="/amaala-residences" element={<AmaalaResidencesOverview />} />
          <Route path="/amaala-residences/:id" element={<ResidenceDetails />} />
          {/* REMOVED: MasterplansSitemaps route — to restore, uncomment this route and its import at the top of the file. */}
          {/* <Route path="/masterplans-sitemaps" element={<MasterplansSitemaps />} /> */}
          <Route path="/treatments" element={<TreatmentsListing />} />
          <Route path="/treatments/:id" element={<TreatmentDetails />} />
          {/* REMOVED: DigitalBrochure route — to restore, uncomment this route and its import at the top of the file. */}
          {/* <Route path="/digital-brochure" element={<DigitalBrochure />} /> */}
          <Route path="/family-retreat-inclusions" element={<FamilyRetreatInclusions />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
