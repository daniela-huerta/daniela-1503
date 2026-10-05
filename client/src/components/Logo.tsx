import snailLogo from '../assets/caracol.svg';

interface LogoProps {
  className?: string;
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 text-lg font-extrabold text-bark-900 ${className}`}>
      <img src={snailLogo} alt="" className="h-8 w-8" />
      Carrera de Caracoles
    </div>
  );
}