import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import RetreatFinder from "./pages/RetreatFinder.tsx";
import RetreatDetails from "./pages/RetreatDetails.tsx";
import ActivityDetails from "./pages/ActivityDetails.tsx";
import WellnessAdvisor from "./pages/WellnessAdvisor.tsx";
import WellnessAdvisorProfile from "./pages/WellnessAdvisorProfile.tsx";
import WhyJayasomResidences from "./pages/WhyJayasomResidences.tsx";
import ResidentialCommunity from "./pages/ResidentialCommunity.tsx";
import AmaalaResidencesOverview from "./pages/AmaalaResidencesOverview.tsx";
import MasterplansSitemaps from "./pages/MasterplansSitemaps.tsx";
import TreatmentsListing from "./pages/TreatmentsListing.tsx";
import TreatmentDetails from "./pages/TreatmentDetails.tsx";
import DigitalBrochure from "./pages/DigitalBrochure.tsx";
import RetreatDetailsV2 from "./pages/RetreatDetailsV2.tsx";
import FamilyRetreatInclusions from "./pages/FamilyRetreatInclusions.tsx";

const queryClient = new QueryClient();

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
          <Route path="/retreat-finder" element={<RetreatFinder />} />
          <Route path="/retreats/:id" element={<RetreatDetails />} />
          <Route path="/retreats-v2/:id" element={<RetreatDetailsV2 />} />
          <Route path="/activity-details" element={<ActivityDetails />} />
          <Route path="/wellness-advisor" element={<WellnessAdvisor />} />
          <Route path="/wellness-advisor/:id" element={<WellnessAdvisorProfile />} />
          <Route path="/why-jayasom-residences" element={<WhyJayasomResidences />} />
          <Route path="/residential-community" element={<ResidentialCommunity />} />
          <Route path="/amaala-residences" element={<AmaalaResidencesOverview />} />
          <Route path="/masterplans-sitemaps" element={<MasterplansSitemaps />} />
          <Route path="/treatments" element={<TreatmentsListing />} />
          <Route path="/treatments/:id" element={<TreatmentDetails />} />
          <Route path="/digital-brochure" element={<DigitalBrochure />} />
          <Route path="/family-retreat-inclusions" element={<FamilyRetreatInclusions />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
