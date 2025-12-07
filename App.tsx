import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import Layout from "@/components/layout-voting";
import AdminRegistration from "@/pages/admin-registration";
import VotingBooth from "@/pages/voting-booth";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={AdminRegistration} />
        <Route path="/voting-booth" component={VotingBooth} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <Router />
    </QueryClientProvider>
  );
}

export default App;
