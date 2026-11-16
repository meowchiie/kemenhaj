import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </Icon>
  );
}

export function ArrowUpRight(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </Icon>
  );
}

export function Search(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </Icon>
  );
}

export function Menu(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 8h16" />
      <path d="M4 16h16" />
    </Icon>
  );
}

export function Close(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </Icon>
  );
}

export function ChevronDown(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m6 9 6 6 6-6" />
    </Icon>
  );
}

export function ChevronLeft(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m14 6-6 6 6 6" />
    </Icon>
  );
}

export function ChevronRight(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m10 6 6 6-6 6" />
    </Icon>
  );
}

export function Download(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 4v11" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 20h14" />
    </Icon>
  );
}

export function FileText(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6" />
      <path d="M9 17h4" />
    </Icon>
  );
}

export function Users(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <path d="M16 5.5a3 3 0 0 1 0 5.6" />
      <path d="M17.5 14.5A5.5 5.5 0 0 1 20.5 19" />
    </Icon>
  );
}

export function Images(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="m4 17 4.5-4.5 3 3L15 12l5 5" />
    </Icon>
  );
}

export function Calendar(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3.5" y="5" width="17" height="16" rx="2" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <path d="M3.5 10h17" />
    </Icon>
  );
}

export function Eye(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.6" />
    </Icon>
  );
}

export function Clock(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </Icon>
  );
}

export function Check(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </Icon>
  );
}

export function Phone(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z" />
    </Icon>
  );
}

export function Mail(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </Icon>
  );
}

export function MapPin(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </Icon>
  );
}

export function Plus(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </Icon>
  );
}

export function Copy(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M15 6.5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h1.5" />
    </Icon>
  );
}

export function Play(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8 5.5v13l11-6.5z" />
    </Icon>
  );
}

export function Pause(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9 5v14" />
      <path d="M15 5v14" />
    </Icon>
  );
}

export function Shield(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 3 5 6v5.5c0 4.5 3 7.6 7 9.5 4-1.9 7-5 7-9.5V6z" />
      <path d="m9 12 2 2 4-4" />
    </Icon>
  );
}
