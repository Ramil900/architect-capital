import { LoadingState } from "./LoadingState";
import { ErrorState }   from "./ErrorState";

export function PageLoading() {
  return <LoadingState />;
}

export function PageError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return <ErrorState title="Failed to load" message={message} onRetry={onRetry} />;
}
