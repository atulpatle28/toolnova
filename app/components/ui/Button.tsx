// Inside app/components/ui/Button.tsx

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg" | "icon"; // Add supported sizes here
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = "primary", 
  size = "md", 
  className = "", 
  children, 
  ...props 
}) => {
  // Add styling classes for the variants/sizes as needed
  return (
    <button className={`btn btn-${variant} btn-${size} ${className}`} {...props}>
      {children}
    </button>
  );
};