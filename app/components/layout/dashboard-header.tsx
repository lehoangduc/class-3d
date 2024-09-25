interface DashboardHeaderProps {
  children?: React.ReactNode
  heading: string
  text?: string
}

export default function DashboardHeader({
  children,
  heading,
  text,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="grid gap-1">
        <h1 className="font-heading text-2xl font-semibold">{heading}</h1>
        {text && <p className="text-base text-muted-foreground">{text}</p>}
      </div>
      {children}
    </div>
  )
}
