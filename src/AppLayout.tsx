interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return <div className="min-h-screen flex flex-col">{children}</div>;
};

export default AppLayout;
