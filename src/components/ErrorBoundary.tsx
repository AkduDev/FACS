import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [state, setState] = React.useState<ErrorBoundaryState>({ hasError: false, error: null });

  React.useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      setState({ hasError: true, error: event.error });
    };
    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  if (state.hasError) {
    return (
      <div className="min-h-screen bg-marine-950 text-white flex flex-col items-center justify-center p-8 text-center">
        <div className="max-w-md">
          <h1 className="text-2xl font-display font-bold mb-4 text-cyan-400">
            Something went wrong
          </h1>
          <p className="text-marine-300 mb-6">
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export { ErrorBoundary };
