import './ShinyButton.css'

export function ShinyButton({
  children,
  onClick,
  className = '',
  size = 'sm',
  type = 'button',
}) {
  return (
    <button
      type={type}
      className={`shiny-cta ${size === 'lg' ? 'shiny-cta-lg' : 'shiny-cta-sm'} ${className}`}
      onClick={onClick}
    >
      <span>{children}</span>
    </button>
  )
}

export default ShinyButton
