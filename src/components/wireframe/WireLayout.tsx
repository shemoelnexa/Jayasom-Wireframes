import WireHeader from "./WireHeader";
import WireFooter from "./WireFooter";
import { ReactNode } from "react";

const WireLayout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <WireHeader />
    <main className="flex-1">{children}</main>
    <WireFooter />
  </div>
);

export default WireLayout;
