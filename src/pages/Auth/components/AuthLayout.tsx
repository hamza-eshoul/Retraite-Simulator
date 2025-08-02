interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-zinc-50 to-zinc-100">
        <div className="w-full max-w-md">{children}</div>
      </div>

      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Insurance Background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4xIi8+PC9zdmc+')]" />

        <div className="relative h-full flex flex-col p-16">
          <div className="flex-1 flex flex-col justify-center">
            <div className="space-y-24">
              <div className="space-y-3">
                <h1 className="text-5xl font-bold text-white">
                  Simulateur d'Économies Fiscales
                </h1>
                <p className="text-[#2fd0a7] text-xl font-medium">
                  Contrat de Retraite
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-4xl font-bold text-white leading-tight">
                  Calculez vos
                  <br />
                  économies fiscales
                </h2>
                <p className="text-lg text-zinc-100 leading-relaxed max-w-md">
                  Estimez les avantages fiscaux liés à la souscription d'un
                  contrat de retraite
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-zinc-400">
              © 2025 Simulateur d'Économies Fiscales. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
