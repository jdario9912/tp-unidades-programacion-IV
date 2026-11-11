import { useState } from "react";
import { esUrlValida } from "@/shared/utils/url";
import { cn } from "@/shared/utils/cn";

type Props = {
  url: string;
  alt?: string;
  className?: string;
};

const ImagenPreview = ({ url, alt = "Vista previa", className }: Props) => {
  const [error, setError] = useState(false);
  const valida = esUrlValida(url.trim());

  return (
    <div
      className={cn(
        "size-12 shrink-0 flex items-center justify-center rounded border border-divider bg-placeholder overflow-hidden text-[10px] text-muted text-center",
        className,
      )}
    >
      {!valida ? (
        "Sin imagen"
      ) : error ? (
        "Error"
      ) : (
        <img
          src={url.trim()}
          alt={alt}
          className="size-full object-cover"
          onError={() => setError(true)}
        />
      )}
    </div>
  );
};

export default ImagenPreview;
