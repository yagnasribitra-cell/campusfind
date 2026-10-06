import { lazy, Suspense, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { CampusShell } from "./components/CampusShell";
import { CampusDataProvider } from "./lib/campusfind-store";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

const CampusMap = lazy(() => import("./pages/CampusMap"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Items = lazy(() => import("./pages/Items"));
const Matches = lazy(() => import("./pages/Matches"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Profile = lazy(() => import("./pages/Profile"));
const ReportItem = lazy(() => import("./pages/ReportItem"));

function Workspace({ children }: { children: ReactNode }) {
  return <CampusShell><Suspense fallback={<PageLoadingSkeleton />}>{children}</Suspense></CampusShell>;
}

function PageLoadingSkeleton() {
  return (
    <div className="cf-page-stack cf-page-skeleton" aria-busy="true" aria-label="Loading CampusFind page">
      <div className="cf-skeleton-heading"><span /><i /><i /></div>
      <section className="cf-stats-grid">{[1, 2, 3, 4].map((item) => <div className="cf-skeleton-stat" key={item}><i /><span><b /><small /></span></div>)}</section>
      <section className="cf-skeleton-panel"><span /><i /><i /><div>{[1, 2, 3].map((item) => <b key={item} />)}</div></section>
      <section className="cf-skeleton-panel"><span /><i /><div>{[1, 2, 3].map((item) => <b key={item} />)}</div></section>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard">
        <Workspace><Dashboard /></Workspace>
      </Route>
      <Route path="/lost">
        <Workspace><Items status="lost" /></Workspace>
      </Route>
      <Route path="/found">
        <Workspace><Items status="found" /></Workspace>
      </Route>
      <Route path="/matches">
        <Workspace><Matches /></Workspace>
      </Route>
      <Route path="/map">
        <Workspace><CampusMap /></Workspace>
      </Route>
      <Route path="/report">
        <Workspace><ReportItem /></Workspace>
      </Route>
      <Route path="/notifications">
        <Workspace><Notifications /></Workspace>
      </Route>
      <Route path="/profile">
        <Workspace><Profile /></Workspace>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <TooltipProvider>
        <CampusDataProvider>
          <Toaster />
          <Router />
        </CampusDataProvider>
      </TooltipProvider>
    </ErrorBoundary>
  );
}
