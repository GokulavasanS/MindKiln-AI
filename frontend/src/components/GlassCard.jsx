/**
 * GlassCard — generic glass-morphism card container.
 * variant: 'forge' | 'clarity'
 */
export default function GlassCard({ children, className = '', variant = 'forge', as: Tag = 'div', ...props }) {
  const base = variant === 'clarity' ? 'glass-card' : 'forge-card'
  return (
    <Tag className={`${base} ${className}`} {...props}>
      {children}
    </Tag>
  )
}
