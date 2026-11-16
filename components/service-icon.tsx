import { FileText, Shield, Users } from "@/components/icons";
import type { Service } from "@/lib/content";

export default function ServiceIcon({
  icon,
  className,
}: {
  icon: Service["icon"];
  className?: string;
}) {
  if (icon === "register") return <FileText className={className} />;
  if (icon === "transfer") return <Users className={className} />;
  return <Shield className={className} />;
}
