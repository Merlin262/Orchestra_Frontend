export default function AuthLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-muted rounded-lg animate-pulse"></div>
          <div className="h-6 bg-muted rounded animate-pulse"></div>
          <div className="h-4 bg-muted rounded animate-pulse w-3/4 mx-auto"></div>
        </div>

        <div className="bg-card rounded-lg border p-6 space-y-4">
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse w-1/4"></div>
            <div className="h-10 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse w-1/4"></div>
            <div className="h-10 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="h-10 bg-muted rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
