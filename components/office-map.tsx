const MAPS_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3979.9054048727926!2d119.62649187626431!3d-4.039724344837666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2d95bb002f6f43fb%3A0xea843873dbdb6886!2sKantor%20Kementerian%20Haji%20dan%20Umrah%20Kota%20Parepare!5e0!3m2!1sen!2sid!4v1795331084671!5m2!1sen!2sid";

interface OfficeMapProps {
  className?: string;
  title?: string;
}

export default function OfficeMap({
  className = "",
  title = "Lokasi Kantor Kementerian Haji dan Umrah Kota Parepare",
}: OfficeMapProps) {
  return (
    <div
      className={`relative aspect-[4/3] w-full overflow-hidden rounded-[20px] bg-soft ${className}`}
    >
      <iframe
        src={MAPS_EMBED_SRC}
        title={title}
        className="h-full w-full border-0"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}